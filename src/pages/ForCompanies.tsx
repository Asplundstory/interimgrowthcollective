"use client";

import { Hero, Section, SectionHeader, CTA, FAQ } from "@/components/editorial";
import { SEO, FAQItem, HowToData } from "@/components/SEO";
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

  const howToHireInterim: HowToData = {
    name: language === "en" 
      ? "How to Hire an Interim Consultant" 
      : "Så anlitar du en interimkonsult",
    description: language === "en"
      ? "A step-by-step guide to hiring the right interim consultant for your brand, marketing, or communication needs."
      : "En steg-för-steg-guide för att anlita rätt interimkonsult inom varumärke, marknadsföring eller kommunikation.",
    totalTime: "P7D", // Estimated 7 days for the full process
    steps: [
      {
        name: language === "en" ? "Define Your Needs" : "Definiera dina behov",
        text: language === "en"
          ? "Identify the specific role, skills, and duration needed. Consider whether you need strategic leadership, hands-on execution, or both."
          : "Identifiera den specifika rollen, kompetensen och längden på uppdraget. Fundera på om du behöver strategiskt ledarskap, operativt genomförande eller båda.",
      },
      {
        name: language === "en" ? "Contact Us" : "Kontakta oss",
        text: language === "en"
          ? "Reach out with your brief. We'll schedule a consultation to understand your challenges and requirements in detail."
          : "Hör av dig med din brief. Vi bokar ett möte för att förstå dina utmaningar och krav i detalj.",
        url: "/contact",
      },
      {
        name: language === "en" ? "Review Matched Candidates" : "Granska matchade kandidater",
        text: language === "en"
          ? "We present carefully selected candidates from our network who match your specific needs and company culture."
          : "Vi presenterar noggrant utvalda kandidater från vårt nätverk som matchar dina specifika behov och företagskultur.",
      },
      {
        name: language === "en" ? "Interview and Select" : "Intervjua och välj",
        text: language === "en"
          ? "Meet your top candidates. We facilitate the process to ensure the best fit for both parties."
          : "Träffa dina toppkandidater. Vi underlättar processen för att säkerställa bästa matchning för båda parter.",
      },
      {
        name: language === "en" ? "Onboard and Start" : "Onboarda och starta",
        text: language === "en"
          ? "Your interim consultant begins work with clear objectives and deliverables. We stay involved to ensure success."
          : "Din interimkonsult börjar arbeta med tydliga mål och leverabler. Vi finns kvar för att säkerställa framgång.",
      },
    ],
  };

  return (
    <>
      <SEO 
        title={t("nav.forCompanies")}
        description={t("companies.intro.text")}
        faq={faqItems}
        howTo={howToHireInterim}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.forCompanies"), href: getLocalizedPath("/for-companies") },
        ]}
        preloadImage={defaultHeroImage}
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
