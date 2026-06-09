import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MagicLinkRequest {
  email: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Cryptographically secure 6-digit OTP
const generateOtp = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (100000 + (buf[0] % 900000)).toString();
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    if (action === "request") {
      const { email }: MagicLinkRequest = await req.json();
      if (!email) return json(400, { error: "Email krävs" });

      const { data: clientUser, error: userError } = await supabase
        .from("client_users")
        .select("id, name, company_id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      // Always respond with same message to avoid enumeration
      const genericOk = { success: true, message: "Om kontot finns skickas en kod till din e-post" };

      if (userError || !clientUser) {
        return json(200, genericOk);
      }

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const { error: sessionError } = await supabase
        .from("client_sessions")
        .insert({
          client_user_id: clientUser.id,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        console.error("Session error:", sessionError);
        return json(500, { error: "Kunde inte skapa session" });
      }

      const { error: emailError } = await resend.emails.send({
        from: "IGC Portal <noreply@interimgrowthcollective.se>",
        to: [email],
        subject: "Din inloggningskod till IGC Kundportal",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Hej ${clientUser.name}!</h1>
            <p style="color: #4a4a4a; font-size: 16px;">Din engångskod för att logga in i IGC Kundportal är:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1a1a1a;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">Koden är giltig i 15 minuter.</p>
            <p style="color: #666; font-size: 14px;">Om du inte begärt denna kod kan du ignorera detta meddelande.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
            <p style="color: #999; font-size: 12px;">Interim Growth Collective</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Email error:", emailError);
        return json(500, { error: "Kunde inte skicka e-post" });
      }

      return json(200, { success: true, message: "Kod skickad till din e-post" });
    }

    if (action === "verify") {
      const { email, otp }: VerifyOtpRequest = await req.json();
      if (!email || !otp) return json(400, { error: "E-post och kod krävs" });

      const { data: clientUser, error: userError } = await supabase
        .from("client_users")
        .select("id, name, email, company_id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (userError || !clientUser) return json(401, { error: "Ogiltig kod" });

      const { data: session, error: sessionError } = await supabase
        .from("client_sessions")
        .select("id, expires_at")
        .eq("client_user_id", clientUser.id)
        .eq("otp_code", otp)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError || !session) return json(401, { error: "Ogiltig eller utgången kod" });

      // Issue a fresh server-validated portal session token (7 days)
      const sessionToken = crypto.randomUUID() + "." + crypto.randomUUID();
      const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await supabase
        .from("client_sessions")
        .update({
          verified: true,
          session_token: sessionToken,
          expires_at: newExpiry.toISOString(),
        })
        .eq("id", session.id);

      await supabase
        .from("client_users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", clientUser.id);

      const { data: company } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", clientUser.company_id)
        .maybeSingle();

      return json(200, {
        success: true,
        sessionToken,
        expiresAt: newExpiry.toISOString(),
        user: {
          id: clientUser.id,
          name: clientUser.name,
          email: clientUser.email,
          company_id: clientUser.company_id,
          company_name: company?.name || "Okänt företag",
        },
      });
    }

    return json(400, { error: "Okänd åtgärd" });
  } catch (error) {
    console.error("Error:", error);
    return json(500, { error: "Ett fel uppstod" });
  }
});
