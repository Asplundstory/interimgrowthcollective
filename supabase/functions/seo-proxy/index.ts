import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AEO_API_BASE = "https://bchbtntgqvxqqrkhhbzd.supabase.co/functions/v1";

async function requireAdmin(req: Request) {
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false as const, resp: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders }) };
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error } = await supabase.auth.getClaims(token);
  if (error || !claims?.claims?.sub) {
    return { ok: false as const, resp: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders }) };
  }
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: claims.claims.sub, _role: "admin" });
  if (!isAdmin) {
    return { ok: false as const, resp: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: jsonHeaders }) };
  }
  return { ok: true as const };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("AEO_API_KEY");
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
  if (!apiKey) {
    return new Response(JSON.stringify({ success: false, error: "AEO_API_KEY not configured" }), { status: 500, headers: jsonHeaders });
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.resp;

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
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (action === "result") {
      const auditId = url.searchParams.get("auditId");
      if (!auditId) return new Response(JSON.stringify({ success: false, error: "auditId required" }), { status: 400, headers: jsonHeaders });
      const response = await fetch(`${AEO_API_BASE}/api-audit-result?auditId=${encodeURIComponent(auditId)}`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (action === "health") {
      const response = await fetch(`${AEO_API_BASE}/api-health`, { headers: { "X-API-Key": apiKey } });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), { status: 400, headers: jsonHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: jsonHeaders });
  }
});
