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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { documentId, signerName, signedAt }: SignedNotificationRequest = await req.json();

    console.log("Sending signed notification for document:", documentId);

    // Fetch document details
    const { data: document, error: fetchError } = await supabase
      .from("generated_documents")
      .select("title, sender_email, signer_email")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      console.error("Error fetching document:", fetchError);
      throw new Error("Kunde inte hämta dokument");
    }

    if (!document.sender_email) {
      console.log("No sender email configured, skipping notification");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "No sender email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const formattedDate = new Date(signedAt).toLocaleString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interim Growth Collective <onboarding@resend.dev>",
        to: [document.sender_email],
        subject: `✅ Dokument signerat: ${document.title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Dokumentet har signerats</h1>
            
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="color: #166534; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">
                ✅ Signering bekräftad
              </p>
              <p style="color: #15803d; font-size: 14px; margin: 0;">
                ${signerName} har signerat dokumentet.
              </p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Dokument</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px; font-weight: 500;">${document.title}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Signerat av</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${signerName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">E-post</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">${document.signer_email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Tidpunkt</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${formattedDate}</td>
              </tr>
            </table>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Du kan se det signerade dokumentet i admin-panelen under Dokument.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            
            <p style="color: #999; font-size: 12px;">
              Interim Growth Collective<br />
              Detta mail skickades automatiskt.
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

    console.log("Signed notification email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-document-signed function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
