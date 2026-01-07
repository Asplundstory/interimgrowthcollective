import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

const SITE_URL = "https://interimgrowthcollective.se";

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

// Generate URL entry with hreflang alternates
const generateUrlEntry = (path: string, changefreq: string, priority: string, lastmod?: string) => {
  const svUrl = `${SITE_URL}${path}`;
  const enUrl = path === "/" ? `${SITE_URL}/en` : `${SITE_URL}/en${path}`;
  
  let entry = `
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
  
  return entry;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published insights
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

    // Generate XML with xhtml namespace for hreflang
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Add static pages (both languages)
    for (const page of staticPages) {
      xml += generateUrlEntry(page.loc, page.changefreq, page.priority);
    }

    // Add dynamic insight pages (both languages)
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
      headers: corsHeaders,
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
      { headers: corsHeaders, status: 200 }
    );
  }
});
