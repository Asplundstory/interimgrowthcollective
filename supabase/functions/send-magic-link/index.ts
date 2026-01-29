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

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
      // Request magic link
      const { email }: MagicLinkRequest = await req.json();

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email krävs" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find client user
      const { data: clientUser, error: userError } = await supabase
        .from("client_users")
        .select("id, name, company_id")
        .eq("email", email.toLowerCase())
        .single();

      if (userError || !clientUser) {
        // Don't reveal if email exists - just say "check your email"
        return new Response(
          JSON.stringify({ success: true, message: "Om kontot finns skickas en kod till din e-post" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate OTP
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save session
      const { error: sessionError } = await supabase
        .from("client_sessions")
        .insert({
          client_user_id: clientUser.id,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        console.error("Session error:", sessionError);
        return new Response(
          JSON.stringify({ error: "Kunde inte skapa session" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Send email
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
        return new Response(
          JSON.stringify({ error: "Kunde inte skicka e-post" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Kod skickad till din e-post" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "verify") {
      // Verify OTP
      const { email, otp }: VerifyOtpRequest = await req.json();

      if (!email || !otp) {
        return new Response(
          JSON.stringify({ error: "E-post och kod krävs" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find client user
      const { data: clientUser, error: userError } = await supabase
        .from("client_users")
        .select("id, name, email, company_id")
        .eq("email", email.toLowerCase())
        .single();

      if (userError || !clientUser) {
        return new Response(
          JSON.stringify({ error: "Ogiltig kod" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find valid session
      const { data: session, error: sessionError } = await supabase
        .from("client_sessions")
        .select("id, expires_at")
        .eq("client_user_id", clientUser.id)
        .eq("otp_code", otp)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (sessionError || !session) {
        return new Response(
          JSON.stringify({ error: "Ogiltig eller utgången kod" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark session as verified
      await supabase
        .from("client_sessions")
        .update({ verified: true })
        .eq("id", session.id);

      // Update last login
      await supabase
        .from("client_users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", clientUser.id);

      // Get company info
      const { data: company } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", clientUser.company_id)
        .single();

      return new Response(
        JSON.stringify({
          success: true,
          session: {
            id: session.id,
            user: {
              id: clientUser.id,
              name: clientUser.name,
              email: clientUser.email,
              company_id: clientUser.company_id,
              company_name: company?.name || "Okänt företag",
            },
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Okänd åtgärd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
