import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InvitationRequest {
  applicationId: string;
  name: string;
  email: string;
  role: string;
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // --- AuthN ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Unauthorized" });
    }
    const token = authHeader.replace("Bearer ", "");

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claims?.claims?.sub) {
      return json(401, { error: "Unauthorized" });
    }
    const userId = claims.claims.sub as string;

    const admin = createClient(supabaseUrl, serviceKey);

    // --- AuthZ: must be admin ---
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) return json(403, { error: "Forbidden" });

    const { applicationId, name, email, role }: InvitationRequest = await req.json();
    if (!applicationId || !name || !email || !role) {
      return json(400, { error: "Missing required fields" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { error: "Invalid email" });
    }

    const invToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error: updateError } = await admin
      .from("creator_applications")
      .update({
        status: "invited",
        invitation_token: invToken,
        invitation_sent_at: new Date().toISOString(),
        invitation_expires_at: expiresAt.toISOString(),
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return json(500, { error: "Could not update application" });
    }

    const baseUrl = Deno.env.get("SITE_URL") || "https://interimgrowthcollective.lovable.app";
    const invitationUrl = `${baseUrl}/apply/${invToken}`;

    const firstName = String(name).split(" ")[0] || name;

    const emailResult = await resend.emails.send({
      from: "Interim Growth Collective <noreply@interimgrowthcollective.se>",
      to: [email],
      subject: "Inbjudan att slutföra din registrering",
      html: `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Välkommen, ${firstName}!</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin-top: 0;">Vi har granskat din intresseanmälan och är glada att kunna bjuda in dig att slutföra din registrering i vårt nätverk av interimkonsulter.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Din anmälda roll:</strong> ${role}</p>
            </div>
            <p>Klicka på knappen nedan för att fylla i kompletterande uppgifter och slutföra din registrering:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" style="display: inline-block; background: #1a1a2e; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Slutför registrering</a>
            </div>
            <p style="color: #666; font-size: 14px;"><strong>Observera:</strong> Denna länk är giltig i 7 dagar.</p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin-bottom: 0;">Om du inte har ansökt till Interim Growth Collective kan du bortse från detta mail.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResult);

    return json(200, { success: true, token: invToken, expiresAt: expiresAt.toISOString() });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-candidate-invitation:", errorMessage);
    return json(500, { error: errorMessage });
  }
};

serve(handler);
