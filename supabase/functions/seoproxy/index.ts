const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AEO_API_BASE = "https://bchbtntgqvxqqrkhhbzd.supabase.co/functions/v1";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("AEO_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "AEO_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "health";

    if (action === "start") {
      const body = await req.json();
      const response = await fetch(`${AEO_API_BASE}/api-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ url: body.targetUrl, siteType: body.siteType || "service" }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "result") {
      const auditId = url.searchParams.get("auditId");
      if (!auditId) {
        return new Response(
          JSON.stringify({ success: false, error: "auditId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const response = await fetch(`${AEO_API_BASE}/api-audit-result?auditId=${auditId}`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "health") {
      const response = await fetch(`${AEO_API_BASE}/api-health`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("AEO Audit error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
