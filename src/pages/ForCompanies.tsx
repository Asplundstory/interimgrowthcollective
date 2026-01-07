"use client";

import { Hero, Section, SectionHeader, CTA, FAQ } from "@/components/editorial";
import { SEO, FAQItem } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";
import defaultHeroImage from "@/assets/hero-companies.jpg";

export default function ForCompaniesPage() {
  const { t, getLocalizedPath, language } = useLanguage();

  const processSteps = [
    {
      title: t("companies.process.1.title"),
      description: t("companies.process.1.description"),
    },
    {
      title: t("companies.process.2.title"),
      description: t("companies.process.2.description"),
    },
    {
      title: t("companies.process.3.title"),
      description: t("companies.process.3.description"),
    },
  ];

  const offerItems = [
    {
      title: t("companies.offer.1.title"),
      description: t("companies.offer.1.description"),
    },
    {
      title: t("companies.offer.2.title"),
      description: t("companies.offer.2.description"),
    },
    {
      title: t("companies.offer.3.title"),
      description: t("companies.offer.3.description"),
    },
    {
      title: t("companies.offer.4.title"),
      description: t("companies.offer.4.description"),
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: t("companies.faq.1.question"),
      answer: t("companies.faq.1.answer"),
    },
    {
      question: t("companies.faq.2.question"),
      answer: t("companies.faq.2.answer"),
    },
    {
      question: t("companies.faq.3.question"),
      answer: t("companies.faq.3.answer"),
    },
  ];

  return (
    <>
      <SEO 
        title={t("nav.forCompanies")}
        description={t("companies.intro.text")}
        faq={faqItems}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.forCompanies"), href: getLocalizedPath("/for-companies") },
        ]}
      />
      {/* Hero */}
      <Hero 
        headline={t("companies.hero.headline")}
        subheadline={t("companies.hero.subheadline")}
        size="medium"
        backgroundImage={defaultHeroImage}
      />
      
      {/* Intro */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("companies.intro.text")}
          </p>
        </div>
      </Section>
      
      {/* Process */}
      <Section spacing="large">
        <SectionHeader headline={t("companies.process.headline")} />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {processSteps.map((step, index) => (
            <div 
              key={index} 
              className="fade-in-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-label block mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-editorial">
                {step.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      
      {/* What we offer */}
      <Section background="card" spacing="large">
        <SectionHeader headline={t("companies.offer.headline")} />
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          {offerItems.map((item, index) => (
            <div key={index}>
              <h3 className="font-serif text-lg text-editorial">
                {item.title}
              </h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      
      {/* FAQ */}
      <Section spacing="large">
        <SectionHeader 
          label="FAQ"
          headline={t("companies.faq.headline")}
        />
        <FAQ items={faqItems} />
      </Section>
      
      {/* CTA */}
      <CTA 
        headline={t("home.cta.headline")}
        text={t("home.cta.text")}
        buttonText={t("home.cta.button")}
        href={getLocalizedPath("/contact")}
        variant="subtle"
      />
    </>
  );
}
