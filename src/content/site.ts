// Site-wide configuration
// TODO: Uppdatera med faktisk kontaktinfo och text

export const siteConfig = {
  siteName: "Interim Growth Collective",
  tagline: "Människor med känsla. På plats.",
  description: "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner. Vi förmedlar erfarna människor som förstår både strategi och hantverk.",
  contactEmail: "hej@interimgrowth.se",
  
  // SEO defaults
  seo: {
    titleTemplate: "%s — Interim Growth Collective",
    defaultTitle: "Interim Growth Collective",
    defaultDescription: "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner. Människor med känsla, på plats.",
    // TODO: Byt mot faktisk OG-bild
    ogImage: "/og-image.jpg",
  },
  
  // Social links (TODO: Uppdatera med faktiska länkar)
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
