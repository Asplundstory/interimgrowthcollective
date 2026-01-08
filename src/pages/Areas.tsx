import { Hero, Section, AreaGrid } from "@/components/editorial";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";

import areaBrandImage from "@/assets/area-brand.jpg";
import areaMarketingImage from "@/assets/area-marketing.jpg";
import areaCommunicationImage from "@/assets/area-communication.jpg";
import areaCreativeImage from "@/assets/area-creative.jpg";

export default function AreasPage() {
  const { t, getLocalizedPath, language } = useLanguage();

  const areas = [
    {
      id: "brand",
      title: t("areas.brand.title"),
      description: t("areas.brand.description"),
      examples: ["Brand Strategy", "Brand Identity", "Brand Guidelines", "Tone of Voice"],
      image: areaBrandImage,
    },
    {
      id: "marketing",
      title: t("areas.marketing.title"),
      description: t("areas.marketing.description"),
      examples: ["Marketing Strategy", "Content Strategy", "Campaign Planning", "Marketing Operations"],
      image: areaMarketingImage,
    },
    {
      id: "communication",
      title: language === "en" ? "Communication" : "Kommunikation",
      description: t("areas.communication.description"),
      examples: ["Corporate Communication", "PR", "Internal Communication", "Crisis Communication"],
      image: areaCommunicationImage,
    },
    {
      id: "creative",
      title: t("areas.creative.title"),
      description: t("areas.creative.description"),
      examples: ["Art Direction", "Graphic Design", "Interior Design", "Architecture", "Music Production", "Film Production"],
      image: areaCreativeImage,
    },
  ];

  return (
    <>
      <SEO 
        title={t("nav.areas")}
        description={t("areas.hero.subheadline")}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.areas"), href: getLocalizedPath("/areas") },
        ]}
      />
      
      {/* Hero */}
      <Hero 
        headline={t("areas.hero.headline")}
        subheadline={t("areas.hero.subheadline")}
        size="medium"
      />
      
      {/* Areas */}
      <Section spacing="large">
        <h2 className="sr-only">{language === "en" ? "Our Areas of Expertise" : "Våra kompetensområden"}</h2>
        <AreaGrid areas={areas} />
      </Section>
      
      {/* Additional context */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-muted-foreground leading-relaxed">
            {t("areas.context.1")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("areas.context.2")}
          </p>
        </div>
      </Section>
    </>
  );
}
