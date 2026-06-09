import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-portal-token",
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
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  try {
    // Read portal session token from custom header
    const portalToken = req.headers.get("x-portal-token");
    if (!portalToken) return json(401, { error: "Missing portal token" });

    // Look up valid session
    const { data: session, error: sessionError } = await admin
      .from("client_sessions")
      .select("id, client_user_id, expires_at, verified, session_token")
      .eq("session_token", portalToken)
      .eq("verified", true)
      .maybeSingle();

    if (sessionError || !session) return json(401, { error: "Invalid session" });
    if (new Date(session.expires_at) < new Date()) {
      return json(401, { error: "Session expired" });
    }

    // Resolve the client user + company
    const { data: clientUser, error: userError } = await admin
      .from("client_users")
      .select("id, name, email, company_id")
      .eq("id", session.client_user_id)
      .maybeSingle();

    if (userError || !clientUser) return json(401, { error: "Invalid session" });

    const companyId = clientUser.company_id;

    const body = await req.json().catch(() => ({}));
    const action: string = body.action;

    if (action === "me") {
      const { data: company } = await admin
        .from("companies")
        .select("id, name")
        .eq("id", companyId)
        .maybeSingle();
      return json(200, {
        user: {
          id: clientUser.id,
          name: clientUser.name,
          email: clientUser.email,
          company_id: companyId,
          company_name: company?.name || "",
        },
      });
    }

    if (action === "documents") {
      const { data, error } = await admin
        .from("client_documents")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json(200, { data });
    }

    if (action === "invoices") {
      const { data, error } = await admin
        .from("invoices")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json(200, { data });
    }

    if (action === "signed_documents") {
      const { data, error } = await admin
        .from("generated_documents")
        .select("id, title, content, status, signed_at, signed_by, created_at")
        .eq("company_id", companyId)
        .eq("status", "signed")
        .order("signed_at", { ascending: false });
      if (error) throw error;
      return json(200, { data });
    }

    if (action === "proposals") {
      const { data, error } = await admin
        .from("deals")
        .select(`
          id, title, status, value, currency, proposal_id,
          proposals ( id, project_title, client_name, status, slug, created_at, updated_at )
        `)
        .eq("company_id", companyId)
        .not("proposal_id", "is", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json(200, { data });
    }

    if (action === "logout") {
      await admin
        .from("client_sessions")
        .update({ session_token: null, verified: false })
        .eq("id", session.id);
      return json(200, { success: true });
    }

    return json(400, { error: "Unknown action" });
  } catch (error: any) {
    console.error("client-portal error:", error);
    return json(500, { error: error.message || "Internal error" });
  }
});
