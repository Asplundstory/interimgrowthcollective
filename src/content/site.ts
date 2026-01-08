// Site-wide configuration

export const siteConfig = {
  siteName: "Interim Growth Collective",
  tagline: "Människor med känsla",
  description:
    "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner. Vi hjälper dig att hitta erfarna människor som förstår både strategi och hantverk.",
  
  // Contact details
  contactEmail: "hej@interimgrowthcollective.se",
  phone: "+46 70 759 13 61",
  phoneFormatted: "+46-70-759-13-61",
  
  address: {
    street: "Tenngjutargränd 4",
    postalCode: "12940",
    city: "Hägersten",
    country: "Sweden",
    countryCode: "SE",
    // Coordinates for Hägersten
    latitude: 59.2989,
    longitude: 18.0132,
  },

  teamEmails: {
    general: "hej@interimgrowthcollective.se",
    lina: "lina@interimgrowthcollective.se",
    pelle: "pelle@interimgrowthcollective.se",
  },

  // Legal entity
  legalEntity: {
    name: "The Asplund Story AB",
    orgNumber: "559106-4216",
    note: "Interim Growth Collective är en del av The Asplund Story AB, separat aktiebolag under bildande.",
  },

  foundingDate: "2024",

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
