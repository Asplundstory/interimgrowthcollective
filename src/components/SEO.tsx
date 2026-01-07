import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/content/site";

interface ArticleData {
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: ArticleData;
  faq?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
}

// Organization schema - shown on all pages
const getOrganizationSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.siteName,
  description: siteConfig.description,
  url: origin,
  logo: `${origin}/favicon.png`,
  email: siteConfig.contactEmail,
  sameAs: [siteConfig.social.linkedin],
  areaServed: "SE",
  serviceType: [
    "Interim Management",
    "Brand Strategy",
    "Marketing Strategy",
    "Communication",
    "Creative Services",
  ],
});

// Generate Article schema
const generateArticleSchema = (
  title: string,
  description: string,
  image: string,
  article: ArticleData,
  url: string,
  origin: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description,
  image: image,
  datePublished: article.publishedTime,
  dateModified: article.modifiedTime || article.publishedTime,
  author: {
    "@type": "Organization",
    name: siteConfig.siteName,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.siteName,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/favicon.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
  keywords: article.tags?.join(", "),
});

// Generate FAQ schema
const generateFAQSchema = (faq: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

// Generate BreadcrumbList schema
const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[], origin: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${origin}${item.href}`,
  })),
});

export function SEO({
  title,
  description = siteConfig.seo.defaultDescription,
  image = siteConfig.seo.ogImage,
  article,
  faq,
  breadcrumbs,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? siteConfig.seo.titleTemplate.replace("%s", title)
    : siteConfig.seo.defaultTitle;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "";
  const absoluteImage = image.startsWith("http") 
    ? image 
    : `${origin}${image}`;

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
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Article specific meta */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD: Organization (always) */}
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationSchema(origin))}
      </script>

      {/* JSON-LD: BreadcrumbList (when breadcrumbs prop provided) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs, origin))}
        </script>
      )}

      {/* JSON-LD: Article (when article prop provided) */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify(
            generateArticleSchema(fullTitle, description, absoluteImage, article, canonicalUrl, origin)
          )}
        </script>
      )}

      {/* JSON-LD: FAQ (when faq prop provided) */}
      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faq))}
        </script>
      )}
    </Helmet>
  );
}

// Export types for use in other components
export type { FAQItem, BreadcrumbItem };

