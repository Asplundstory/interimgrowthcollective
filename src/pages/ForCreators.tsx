"use client";

import { Hero, Section, SectionHeader, CreatorForm, FAQ } from "@/components/editorial";
import { SEO, FAQItem, HowToData } from "@/components/SEO";
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

  const faqItems: FAQItem[] = [
    {
      question: t("creators.faq.1.question"),
      answer: t("creators.faq.1.answer"),
    },
    {
      question: t("creators.faq.2.question"),
      answer: t("creators.faq.2.answer"),
    },
    {
      question: t("creators.faq.3.question"),
      answer: t("creators.faq.3.answer"),
    },
  ];

  const howToJoinNetwork: HowToData = {
    name: language === "en" 
      ? "How to Join Our Creative Network" 
      : "Så blir du en del av vårt nätverk",
    description: language === "en"
      ? "A step-by-step guide for experienced professionals to join our curated network of interim consultants in brand, marketing, and communication."
      : "En steg-för-steg-guide för erfarna specialister som vill bli en del av vårt kurerade nätverk av interimkonsulter inom varumärke, marknadsföring och kommunikation.",
    totalTime: "P14D", // Estimated 14 days for the full process
    steps: [
      {
        name: language === "en" ? "Review Requirements" : "Granska kraven",
        text: language === "en"
          ? "Ensure you have significant experience in brand, marketing, communication, or creative fields. We look for senior professionals with a proven track record."
          : "Säkerställ att du har gedigen erfarenhet inom varumärke, marknadsföring, kommunikation eller kreativa områden. Vi söker seniora specialister med dokumenterad framgång.",
      },
      {
        name: language === "en" ? "Prepare Your Portfolio" : "Förbered din portfolio",
        text: language === "en"
          ? "Gather examples of your best work and prepare a portfolio URL that showcases your expertise and past projects."
          : "Samla exempel på ditt bästa arbete och förbered en portfolio-URL som visar din expertis och tidigare projekt.",
      },
      {
        name: language === "en" ? "Submit Application" : "Skicka in ansökan",
        text: language === "en"
          ? "Fill out our application form with your details, portfolio, and answers to our personality questions. Be authentic – we value genuine responses."
          : "Fyll i vårt ansökningsformulär med dina uppgifter, portfolio och svar på våra personlighetsfrågor. Var autentisk – vi värdesätter genuina svar.",
        url: "/for-creators",
      },
      {
        name: language === "en" ? "Personal Interview" : "Personlig intervju",
        text: language === "en"
          ? "If your profile matches our network's needs, we'll invite you to a personal conversation to learn more about you and your working style."
          : "Om din profil matchar nätverkets behov bjuder vi in dig till ett personligt samtal för att lära känna dig och ditt sätt att arbeta.",
      },
      {
        name: language === "en" ? "Join the Network" : "Gå med i nätverket",
        text: language === "en"
          ? "Welcome to the collective! You'll be matched with relevant assignments and gain access to our community of like-minded professionals."
          : "Välkommen till kollektivet! Du matchas med relevanta uppdrag och får tillgång till vår gemenskap av likasinnade specialister.",
      },
    ],
  };

  return (
    <>
      <SEO 
        title={t("nav.forCreators")}
        description={t("creators.intro.text")}
        faq={faqItems}
        howTo={howToJoinNetwork}
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
      
      {/* FAQ */}
      <Section spacing="large">
        <SectionHeader 
          label="FAQ"
          headline={t("creators.faq.headline")}
        />
        <FAQ items={faqItems} />
      </Section>
    </>
  );
}
