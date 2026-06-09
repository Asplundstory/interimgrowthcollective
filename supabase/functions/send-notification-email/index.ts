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

interface ContactEmailRequest {
  type: "contact" | "creator";
  submissionId?: string; // server-validated reference
  applicationId?: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
  role?: string;
  portfolioUrl?: string;
  q1Feeling?: string;
  q2Structure?: string;
  q3Pressure?: string;
}

// Basic HTML escape to prevent injection in admin email body
const esc = (s: unknown): string => {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const nl = (s: unknown) => esc(s).replace(/\n/g, "<br />");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    console.log("Received email request:", data.type, "from:", data.email);

    // Validate the call corresponds to a real recently-created DB row.
    // This prevents this endpoint from being used as an open relay.
    const admin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (data.type === "contact") {
      if (!data.submissionId) {
        return new Response(JSON.stringify({ error: "submissionId required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { data: row, error } = await admin
        .from("contact_submissions")
        .select("id, email, created_at")
        .eq("id", data.submissionId)
        .maybeSingle();
      if (error || !row || row.email !== data.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      // Only allow notifications for very recent submissions (5 min)
      if (Date.now() - new Date(row.created_at).getTime() > 5 * 60 * 1000) {
        return new Response(JSON.stringify({ error: "Submission too old" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else if (data.type === "creator") {
      if (!data.applicationId) {
        return new Response(JSON.stringify({ error: "applicationId required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { data: row, error } = await admin
        .from("creator_applications")
        .select("id, email, created_at")
        .eq("id", data.applicationId)
        .maybeSingle();
      if (error || !row || row.email !== data.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      if (Date.now() - new Date(row.created_at).getTime() > 5 * 60 * 1000) {
        return new Response(JSON.stringify({ error: "Application too old" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let subject: string;
    let htmlContent: string;

    if (data.type === "contact") {
      subject = `Nytt kontaktformulär: ${esc(data.name)}`;
      htmlContent = `
        <h1>Nytt meddelande via kontaktformuläret</h1>
        <p><strong>Namn:</strong> ${esc(data.name)}</p>
        <p><strong>E-post:</strong> ${esc(data.email)}</p>
        ${data.company ? `<p><strong>Företag:</strong> ${esc(data.company)}</p>` : ""}
        <hr />
        <p><strong>Meddelande:</strong></p>
        <p>${nl(data.message)}</p>
      `;
    } else {
      subject = `Ny ansökan: ${esc(data.name)} - ${esc(data.role)}`;
      htmlContent = `
        <h1>Ny ansökan till Collective</h1>
        <p><strong>Namn:</strong> ${esc(data.name)}</p>
        <p><strong>E-post:</strong> ${esc(data.email)}</p>
        <p><strong>Roll:</strong> ${esc(data.role)}</p>
        <p><strong>Portfolio:</strong> ${esc(data.portfolioUrl)}</p>
        <hr />
        <h2>Svar på frågor</h2>
        <p><strong>1. Beskriv ett uppdrag där känslan avgjorde kvaliteten i leveransen:</strong></p>
        <p>${nl(data.q1Feeling)}</p>
        <p><strong>2. Hur skapar du struktur utan att döda kreativitet?</strong></p>
        <p>${nl(data.q2Structure)}</p>
        <p><strong>3. Vad behöver du för att leverera stabilt under press?</strong></p>
        <p>${nl(data.q3Pressure)}</p>
      `;
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interim Growth Collective <onboarding@resend.dev>",
        to: ["pelle@asplundstory.se"],
        subject,
        html: htmlContent,
      }),
    });

    const responseData = await emailResponse.json();
    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
