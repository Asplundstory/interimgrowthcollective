import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignedNotificationRequest {
  documentId: string;
  signerName: string;
  signedAt: string;
  signingToken?: string; // proof the caller actually signed
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const esc = (s: unknown) => String(s ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { documentId, signerName, signedAt, signingToken }: SignedNotificationRequest =
      await req.json();

    if (!documentId || !signerName || !signedAt) {
      return json(400, { error: "Missing required fields" });
    }

    // Fetch document details
    const { data: document, error: fetchError } = await supabase
      .from("generated_documents")
      .select("title, sender_email, signer_email, signing_token, status")
      .eq("id", documentId)
      .maybeSingle();

    if (fetchError || !document) {
      return json(404, { error: "Document not found" });
    }

    // Authorize the caller: must present the document's signing_token,
    // OR the document must already be in 'signed' state (called immediately after signing).
    const signingTokenMatches =
      !!signingToken && !!document.signing_token && signingToken === document.signing_token;
    const isAlreadySigned = document.status === "signed";

    if (!signingTokenMatches && !isAlreadySigned) {
      return json(401, { error: "Unauthorized" });
    }

    if (!document.sender_email) {
      return json(200, { success: true, skipped: true, reason: "No sender email" });
    }

    const formattedDate = new Date(signedAt).toLocaleString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interim Growth Collective <onboarding@resend.dev>",
        to: [document.sender_email],
        subject: `Dokument signerat: ${esc(document.title)}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Dokumentet har signerats</h1>
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="color: #166534; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Signering bekräftad</p>
              <p style="color: #15803d; font-size: 14px; margin: 0;">${esc(signerName)} har signerat dokumentet.</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Dokument</td><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px; font-weight: 500;">${esc(document.title)}</td></tr>
              <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Signerat av</td><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${esc(signerName)}</td></tr>
              <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">E-post</td><td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${esc(document.signer_email)}</td></tr>
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px;">Tidpunkt</td><td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${esc(formattedDate)}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #999; font-size: 12px;">Interim Growth Collective</p>
          </div>
        `,
      }),
    });

    const emailData = await emailResponse.json();
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Kunde inte skicka e-post");
    }

    return json(200, { success: true });
  } catch (error: any) {
    console.error("Error in notify-document-signed function:", error);
    return json(500, { error: error.message });
  }
};

serve(handler);
