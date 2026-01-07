import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  type: "contact" | "creator";
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    console.log("Received email request:", data.type, "from:", data.email);

    let subject: string;
    let htmlContent: string;

    if (data.type === "contact") {
      subject = `Nytt kontaktformulär: ${data.name}`;
      htmlContent = `
        <h1>Nytt meddelande via kontaktformuläret</h1>
        <p><strong>Namn:</strong> ${data.name}</p>
        <p><strong>E-post:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Företag:</strong> ${data.company}</p>` : ""}
        <hr />
        <p><strong>Meddelande:</strong></p>
        <p>${data.message?.replace(/\n/g, "<br />")}</p>
      `;
    } else {
      subject = `Ny ansökan: ${data.name} - ${data.role}`;
      htmlContent = `
        <h1>Ny ansökan till Collective</h1>
        <p><strong>Namn:</strong> ${data.name}</p>
        <p><strong>E-post:</strong> ${data.email}</p>
        <p><strong>Roll:</strong> ${data.role}</p>
        <p><strong>Portfolio:</strong> <a href="${data.portfolioUrl}">${data.portfolioUrl}</a></p>
        <hr />
        <h2>Svar på frågor</h2>
        <p><strong>1. Beskriv ett uppdrag där känslan avgjorde kvaliteten i leveransen:</strong></p>
        <p>${data.q1Feeling?.replace(/\n/g, "<br />")}</p>
        <p><strong>2. Hur skapar du struktur utan att döda kreativitet?</strong></p>
        <p>${data.q2Structure?.replace(/\n/g, "<br />")}</p>
        <p><strong>3. Vad behöver du för att leverera stabilt under press?</strong></p>
        <p>${data.q3Pressure?.replace(/\n/g, "<br />")}</p>
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
        to: ["pelle.asplund@gmail.com"],
        subject: subject,
        html: htmlContent,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
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
