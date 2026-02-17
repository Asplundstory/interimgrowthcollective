import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://interimgrowthcollective.se";
const AEO_API_BASE = "https://bchbtntgqvxqqrkhhbzd.supabase.co/functions/v1";

// ─── AEO Audit Proxy ───
async function handleAeoProxy(req: Request, url: URL): Promise<Response> {
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
  const apiKey = Deno.env.get("AEO_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "AEO_API_KEY not configured" }),
      { status: 500, headers: jsonHeaders },
    );
  }

  const aeoAction = url.searchParams.get("aeoAction") || "health";

  try {
    if (aeoAction === "start") {
      const body = await req.json();
      const response = await fetch(`${AEO_API_BASE}/api-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ url: body.targetUrl, siteType: body.siteType || "service" }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (aeoAction === "result") {
      const auditId = url.searchParams.get("auditId");
      if (!auditId) {
        return new Response(
          JSON.stringify({ success: false, error: "auditId required" }),
          { status: 400, headers: jsonHeaders },
        );
      }
      const response = await fetch(`${AEO_API_BASE}/api-audit-result?auditId=${auditId}`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    if (aeoAction === "health") {
      const response = await fetch(`${AEO_API_BASE}/api-health`, {
        headers: { "X-API-Key": apiKey },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: jsonHeaders });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid aeoAction" }),
      { status: 400, headers: jsonHeaders },
    );
  } catch (error) {
    console.error("AEO Audit error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: jsonHeaders },
    );
  }
}

// ─── Sitemap Generation ───
const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/for-companies", changefreq: "monthly", priority: "0.9" },
  { loc: "/for-creators", changefreq: "monthly", priority: "0.9" },
  { loc: "/areas", changefreq: "monthly", priority: "0.8" },
  { loc: "/about", changefreq: "monthly", priority: "0.7" },
  { loc: "/insights", changefreq: "weekly", priority: "0.8" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
];

const generateUrlEntry = (path: string, changefreq: string, priority: string, lastmod?: string) => {
  const svUrl = `${SITE_URL}${path}`;
  const enUrl = path === "/" ? `${SITE_URL}/en` : `${SITE_URL}/en${path}`;
  
  return `
  <url>
    <loc>${svUrl}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="sv" href="${svUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${svUrl}"/>
  </url>
  <url>
    <loc>${enUrl}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="sv" href="${svUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${svUrl}"/>
  </url>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Route to AEO proxy if mode=aeo
  if (url.searchParams.get("mode") === "aeo") {
    return handleAeoProxy(req, url);
  }

  // Default: sitemap generation
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: insights, error } = await supabase
      .from("insights")
      .select("slug, updated_at, date")
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }

    console.log(`Found ${insights?.length || 0} published insights`);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    for (const page of staticPages) {
      xml += generateUrlEntry(page.loc, page.changefreq, page.priority);
    }

    if (insights && insights.length > 0) {
      for (const insight of insights) {
        const lastmod = insight.updated_at 
          ? new Date(insight.updated_at).toISOString().split("T")[0]
          : new Date(insight.date).toISOString().split("T")[0];
        xml += generateUrlEntry(`/insights/${insight.slug}`, "monthly", "0.6", lastmod);
      }
    }

    xml += `
</urlset>`;

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
      status: 200,
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`,
      { headers: { ...corsHeaders, "Content-Type": "application/xml" }, status: 200 }
    );
  }
});
