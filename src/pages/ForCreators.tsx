"use client";

import { Hero, Section, SectionHeader, CreatorForm } from "@/components/editorial";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";
import defaultHeroImage from "@/assets/hero-creators.jpg";

export default function ForCreatorsPage() {
  const { t, getLocalizedPath, language } = useLanguage();

  const whatYouGetItems = [
    t("creators.whatYouGet.1"),
    t("creators.whatYouGet.2"),
    t("creators.whatYouGet.3"),
    t("creators.whatYouGet.4"),
  ];

  const whatWeExpectItems = [
    t("creators.whatWeExpect.1"),
    t("creators.whatWeExpect.2"),
    t("creators.whatWeExpect.3"),
    t("creators.whatWeExpect.4"),
  ];

  return (
    <>
      <SEO 
        title={t("nav.forCreators")}
        description={t("creators.intro.text")}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.forCreators"), href: getLocalizedPath("/for-creators") },
        ]}
      />
      {/* Hero */}
      <Hero 
        headline={t("creators.hero.headline")}
        subheadline={t("creators.hero.subheadline")}
        size="medium"
        backgroundImage={defaultHeroImage}
      />
      
      {/* Intro */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("creators.intro.text")}
          </p>
        </div>
      </Section>
      
      {/* Expectations */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* What you get */}
          <div className="fade-in-up">
            <SectionHeader headline={t("creators.whatYouGet.headline")} />
            <ul className="space-y-4">
              {whatYouGetItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* What we expect */}
          <div className="fade-in-up stagger-1">
            <SectionHeader headline={t("creators.whatWeExpect.headline")} />
            <ul className="space-y-4">
              {whatWeExpectItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      
      {/* Application Form */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline={t("creators.form.headline")}
          description={t("form.reviewNote")}
        />
        <div className="max-w-2xl">
          <CreatorForm 
            submitText={t("creators.form.submit")}
            successMessage={t("creators.form.success")}
          />
        </div>
      </Section>
    </>
  );
}
