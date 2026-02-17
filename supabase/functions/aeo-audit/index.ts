const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AEO_API_BASE = "https://bchbtntgqvxqqrkhhbzd.supabase.co/functions/v1";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("AEO_API_KEY");
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "AEO_API_KEY not configured" }),
      { status: 500, headers: jsonHeaders },
    );
  }

  try {
    // Determine action from request body
    const body = await req.json().catch(() => ({}));
    const action = body.action || "health";

    if (action === "start") {
      const response = await fetch(`${AEO_API_BASE}/api-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ url: body.targetUrl, siteType: body.siteType || "service" }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (action === "result") {
      if (!body.auditId) {
        return new Response(
          JSON.stringify({ success: false, error: "auditId required" }),
          { status: 400, headers: jsonHeaders },
        );
      }
      const response = await fetch(`${AEO_API_BASE}/api-audit-result?auditId=${body.auditId}`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (action === "health") {
      const response = await fetch(`${AEO_API_BASE}/api-health`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action. Use: start, result, health" }),
      { status: 400, headers: jsonHeaders },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
