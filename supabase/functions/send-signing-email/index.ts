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

interface SigningEmailRequest {
  documentId: string;
  signerEmail: string;
  signerName: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { documentId, signerEmail, signerName, message }: SigningEmailRequest = await req.json();

    console.log("Sending signing email for document:", documentId, "to:", signerEmail);

    // Generate signing token and expiry (7 days)
    const signingToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Update document with signing info
    const { data: document, error: updateError } = await supabase
      .from("generated_documents")
      .update({
        status: "sent",
        signing_token: signingToken,
        signing_token_expires_at: expiresAt.toISOString(),
        signer_email: signerEmail,
        signer_name: signerName,
      })
      .eq("id", documentId)
      .select("title, content")
      .single();

    if (updateError) {
      console.error("Error updating document:", updateError);
      throw new Error("Kunde inte uppdatera dokument");
    }

    // Get the app URL from environment or use a default
    const appUrl = Deno.env.get("APP_URL") || "https://interimgrowthcollective.lovable.app";
    const signingUrl = `${appUrl}/sign/${signingToken}`;

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interim Growth Collective <onboarding@resend.dev>",
        to: [signerEmail],
        subject: `Signera: ${document.title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Dokument att signera</h1>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hej ${signerName},
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Du har ett dokument att signera: <strong>${document.title}</strong>
            </p>
            
            ${message ? `
              <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <p style="color: #666; font-size: 14px; margin: 0;">${message}</p>
              </div>
            ` : ''}
            
            <div style="margin: 32px 0;">
              <a href="${signingUrl}" 
                 style="background: #1a1a1a; color: white; padding: 14px 28px; 
                        text-decoration: none; border-radius: 6px; font-size: 16px;
                        display: inline-block;">
                Granska och signera
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Denna länk är giltig i 7 dagar.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            
            <p style="color: #999; font-size: 12px;">
              Interim Growth Collective<br />
              Detta mail skickades automatiskt. Vänligen svara inte på detta mail.
            </p>
          </div>
        `,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Kunde inte skicka e-post");
    }

    console.log("Signing email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        signingUrl,
        expiresAt: expiresAt.toISOString() 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-signing-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
