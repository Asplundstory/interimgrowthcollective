import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
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

interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface HowToData {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g., "PT30M" for 30 min
  estimatedCost?: {
    currency: string;
    value: string;
  };
}

interface VideoData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string; // ISO 8601 date, e.g., "2024-01-15"
  duration?: string; // ISO 8601 duration, e.g., "PT1M30S" for 1 min 30 sec
  contentUrl?: string; // Direct URL to video file
  embedUrl?: string; // Embed URL (e.g., YouTube embed)
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: ArticleData;
  faq?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  howTo?: HowToData;
  video?: VideoData;
  noIndex?: boolean;
}

// Organization schema - shown on all pages
const getOrganizationSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.siteName,
  legalName: siteConfig.legalEntity.name,
  description: siteConfig.description,
  url: origin,
  logo: `${origin}/favicon.png`,
  email: siteConfig.contactEmail,
  telephone: siteConfig.phoneFormatted,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.countryCode,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phoneFormatted,
    contactType: "customer service",
    availableLanguage: ["Swedish", "English"],
  },
  foundingDate: siteConfig.foundingDate,
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

// LocalBusiness schema for local SEO
const getLocalBusinessSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${origin}/#localbusiness`,
  name: siteConfig.siteName,
  description: siteConfig.description,
  url: origin,
  logo: `${origin}/favicon.png`,
  image: `${origin}/og-image.jpg`,
  email: siteConfig.contactEmail,
  telephone: siteConfig.phoneFormatted,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressRegion: "Stockholm",
    addressCountry: siteConfig.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.address.latitude,
    longitude: siteConfig.address.longitude,
  },
  areaServed: [
    {
      "@type": "Country",
      name: "Sweden",
    },
    {
      "@type": "AdministrativeArea",
      name: "Scandinavia",
    },
  ],
  priceRange: "$$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: [siteConfig.social.linkedin],
});

// Service schema for service visibility
const getServicesSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Service",
      "@id": `${origin}/#interim-management`,
      position: 1,
      name: "Interim Management",
      description: "Erfarna interimkonsulter som tar operativt ansvar och levererar resultat inom brand, marketing och kommunikation.",
      provider: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
      areaServed: "SE",
      serviceType: "Interim Management",
    },
    {
      "@type": "Service",
      "@id": `${origin}/#brand-strategy`,
      position: 2,
      name: "Brand Strategy",
      description: "Strategiskt varumärkesarbete med erfarna specialister inom positionering, identitet och narrativ.",
      provider: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
      areaServed: "SE",
      serviceType: "Brand Strategy",
    },
    {
      "@type": "Service",
      "@id": `${origin}/#marketing`,
      position: 3,
      name: "Marketing",
      description: "Marknadsföringsexperter som bygger långsiktigt värde genom genomtänkta insatser och strategier.",
      provider: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
      areaServed: "SE",
      serviceType: "Marketing Strategy",
    },
    {
      "@type": "Service",
      "@id": `${origin}/#communication`,
      position: 4,
      name: "Communication",
      description: "Kommunikationsspecialister för extern och intern kommunikation, content och PR.",
      provider: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
      areaServed: "SE",
      serviceType: "Communication",
    },
    {
      "@type": "Service",
      "@id": `${origin}/#creative`,
      position: 5,
      name: "Creative",
      description: "Kreativa specialister inom design, arkitektur, inredning, musik och film.",
      provider: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
      areaServed: "SE",
      serviceType: "Creative Services",
    },
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

// Generate HowTo schema
const generateHowToSchema = (howTo: HowToData, origin: string) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: howTo.name,
  description: howTo.description,
  ...(howTo.totalTime && { totalTime: howTo.totalTime }),
  ...(howTo.estimatedCost && {
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: howTo.estimatedCost.currency,
      value: howTo.estimatedCost.value,
    },
  }),
  step: howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
    ...(step.url && { url: `${origin}${step.url}` }),
    ...(step.image && { image: step.image.startsWith("http") ? step.image : `${origin}${step.image}` }),
  })),
});

// Generate VideoObject schema
const generateVideoSchema = (video: VideoData, origin: string) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl.startsWith("http") 
    ? video.thumbnailUrl 
    : `${origin}${video.thumbnailUrl}`,
  uploadDate: video.uploadDate,
  ...(video.duration && { duration: video.duration }),
  ...(video.contentUrl && { 
    contentUrl: video.contentUrl.startsWith("http") 
      ? video.contentUrl 
      : `${origin}${video.contentUrl}` 
  }),
  ...(video.embedUrl && { embedUrl: video.embedUrl }),
  publisher: {
    "@type": "Organization",
    name: siteConfig.siteName,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/favicon.png`,
    },
  },
});

// Generate hreflang URLs
const getHreflangUrls = (pathname: string, origin: string) => {
  const isEnglish = pathname.startsWith("/en");
  const basePath = isEnglish ? pathname.replace(/^\/en/, "") || "/" : pathname;
  
  const svUrl = `${origin}${basePath}`;
  const enUrl = `${origin}${basePath === "/" ? "/en" : `/en${basePath}`}`;
  
  return { svUrl, enUrl, currentLang: isEnglish ? "en" : "sv" };
};

export function SEO({
  title,
  description = siteConfig.seo.defaultDescription,
  image = siteConfig.seo.ogImage,
  article,
  faq,
  breadcrumbs,
  howTo,
  video,
  noIndex = false,
}: SEOProps) {
  const location = useLocation();
  const fullTitle = title
    ? siteConfig.seo.titleTemplate.replace("%s", title)
    : siteConfig.seo.defaultTitle;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://interimgrowthcollective.se";
  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "";
  const absoluteImage = image.startsWith("http") 
    ? image 
    : `${origin}${image}`;

  const { svUrl, enUrl, currentLang } = getHreflangUrls(location.pathname, origin);

  return (
    <Helmet>
      {/* Basic */}
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags for multilingual SEO */}
      <link rel="alternate" hrefLang="sv" href={svUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={svUrl} />

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

      {/* JSON-LD: LocalBusiness for local SEO */}
      <script type="application/ld+json">
        {JSON.stringify(getLocalBusinessSchema(origin))}
      </script>

      {/* JSON-LD: Services for service visibility */}
      <script type="application/ld+json">
        {JSON.stringify(getServicesSchema(origin))}
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

      {/* JSON-LD: HowTo (when howTo prop provided) */}
      {howTo && howTo.steps.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateHowToSchema(howTo, origin))}
        </script>
      )}

      {/* JSON-LD: VideoObject (when video prop provided) */}
      {video && (
        <script type="application/ld+json">
          {JSON.stringify(generateVideoSchema(video, origin))}
        </script>
      )}
    </Helmet>
  );
}

// Export types for use in other components
export type { FAQItem, BreadcrumbItem, HowToStep, HowToData, VideoData };

