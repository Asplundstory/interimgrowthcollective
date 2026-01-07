import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/content/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: {
    publishedTime?: string;
    tags?: string[];
  };
  noIndex?: boolean;
}

export function SEO({
  title,
  description = siteConfig.seo.defaultDescription,
  image = siteConfig.seo.ogImage,
  article,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? siteConfig.seo.titleTemplate.replace("%s", title)
    : siteConfig.seo.defaultTitle;

  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content={siteConfig.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Helmet>
  );
}
