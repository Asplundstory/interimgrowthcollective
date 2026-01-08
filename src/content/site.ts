// Site-wide configuration

export const siteConfig = {
  siteName: "Interim Growth Collective",
  tagline: "Människor med känsla",
  description:
    "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner. Vi hjälper dig att hitta erfarna människor som förstår både strategi och hantverk.",
  
  // Contact emails
  contactEmail: "hej@interimgrowthcollective.se",
  teamEmails: {
    general: "hej@interimgrowthcollective.se",
    lina: "lina@interimgrowthcollective.se",
    pelle: "pelle@interimgrowthcollective.se",
  },

  // SEO defaults
  seo: {
    titleTemplate: "%s — Interim Growth Collective",
    defaultTitle: "Interim Growth Collective",
    defaultDescription:
      "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner. Människor med känsla, på plats.",
    ogImage: "/og-image.png",
  },

  // Social links
  social: {
    linkedin: "https://linkedin.com/company/interimgrowthcollective",
  },

  // Footer links
  legal: {
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;

export type SiteConfig = typeof siteConfig;
