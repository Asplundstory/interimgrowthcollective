import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SigningEmailRequest {
  documentId: string;
  signerEmail: string;
  signerName: string;
  senderEmail: string;
  message?: string;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AuthN: require a valid bearer token ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Unauthorized" });
    }
    const token = authHeader.replace("Bearer ", "");

    const userClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return json(401, { error: "Unauthorized" });
    }
    const userId = claimsData.claims.sub as string;

    const body: SigningEmailRequest = await req.json();
    const { documentId, signerEmail, signerName, senderEmail, message } = body;

    if (!documentId || !signerEmail || !signerName || !senderEmail) {
      return json(400, { error: "Missing required fields" });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(signerEmail) || !emailRe.test(senderEmail)) {
      return json(400, { error: "Invalid email" });
    }

    const admin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // --- AuthZ: caller must be admin OR creator of the document ---
    const { data: doc, error: docError } = await admin
      .from("generated_documents")
      .select("id, title, content, created_by, status")
      .eq("id", documentId)
      .maybeSingle();

    if (docError || !doc) {
      return json(404, { error: "Document not found" });
    }

    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin && doc.created_by !== userId) {
      return json(403, { error: "Forbidden" });
    }

    console.log("Sending signing email for document:", documentId, "to:", signerEmail);

    const signingToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error: updateError } = await admin
      .from("generated_documents")
      .update({
        status: "sent",
        signing_token: signingToken,
        signing_token_expires_at: expiresAt.toISOString(),
        signer_email: signerEmail,
        signer_name: signerName,
        sender_email: senderEmail,
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Error updating document:", updateError);
      throw new Error("Kunde inte uppdatera dokument");
    }

    const appUrl = Deno.env.get("APP_URL") || "https://interimgrowthcollective.lovable.app";
    const signingUrl = `${appUrl}/sign/${signingToken}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interim Growth Collective <onboarding@resend.dev>",
        to: [signerEmail],
        subject: `Signera: ${doc.title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Dokument att signera</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hej ${signerName},</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Du har ett dokument att signera: <strong>${doc.title}</strong>
            </p>
            ${message ? `<div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;"><p style="color: #666; font-size: 14px; margin: 0;">${message}</p></div>` : ''}
            <div style="margin: 32px 0;">
              <a href="${signingUrl}" style="background: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">Granska och signera</a>
            </div>
            <p style="color: #666; font-size: 14px;">Denna länk är giltig i 7 dagar.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #999; font-size: 12px;">Interim Growth Collective<br />Detta mail skickades automatiskt. Vänligen svara inte på detta mail.</p>
          </div>
        `,
      }),
    });

    const emailData = await emailResponse.json();
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Kunde inte skicka e-post");
    }

    return json(200, { success: true, signingUrl, expiresAt: expiresAt.toISOString() });
  } catch (error: any) {
    console.error("Error in send-signing-email function:", error);
    return json(500, { error: error.message });
  }
};

serve(handler);
