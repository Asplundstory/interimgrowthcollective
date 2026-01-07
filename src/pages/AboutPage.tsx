"use client";

import { Hero, Section, SectionHeader } from "@/components/editorial";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";
import defaultHeroImage from "@/assets/hero-about.jpg";

export default function AboutPage() {
  const { t, getLocalizedPath, language } = useLanguage();

  const values = [
    {
      title: t("about.values.1.title"),
      description: t("about.values.1.description"),
    },
    {
      title: t("about.values.2.title"),
      description: t("about.values.2.description"),
    },
    {
      title: t("about.values.3.title"),
      description: t("about.values.3.description"),
    },
  ];

  return (
    <>
      <SEO 
        title={t("nav.about")}
        description={t("about.story.text").split('\n')[0]}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.about"), href: getLocalizedPath("/about") },
        ]}
      />
      {/* Hero */}
      <Hero 
        headline={t("about.hero.headline")}
        subheadline={t("about.hero.subheadline")}
        size="medium"
        backgroundImage={defaultHeroImage}
      />
      
      {/* Story */}
      <Section spacing="large">
        <div className="max-w-2xl">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {t("about.story.text")}
          </p>
        </div>
      </Section>
      
      {/* Values */}
      <Section background="card" spacing="large">
        <SectionHeader headline={t("about.values.headline")} />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-serif text-lg md:text-xl text-editorial">
                {value.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
