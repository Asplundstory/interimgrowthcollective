"use client";

import { Hero, Section, ContactForm } from "@/components/editorial";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/hooks/useLanguage";
import { siteConfig } from "@/content/site";
import defaultHeroImage from "@/assets/hero-contact.jpg";

export default function ContactPage() {
  const { t, getLocalizedPath, language } = useLanguage();

  return (
    <>
      <SEO 
        title={t("nav.contact")}
        description={t("contact.hero.subheadline")}
        breadcrumbs={[
          { name: language === "en" ? "Home" : "Hem", href: getLocalizedPath("/") },
          { name: t("nav.contact"), href: getLocalizedPath("/contact") },
        ]}
      />
      {/* Hero */}
      <Hero 
        headline={t("contact.hero.headline")}
        subheadline={t("contact.hero.subheadline")}
        size="medium"
        backgroundImage={defaultHeroImage}
      />
      
      {/* Contact options */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Form */}
          <div>
            <ContactForm 
              submitText={t("contact.form.submit")}
              successMessage={t("contact.form.success")}
            />
          </div>
          
          {/* Direct contact */}
          <div className="md:pl-8">
            <h2 className="font-serif text-xl text-editorial mb-4">
              {t("contact.direct.headline")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("contact.direct.text")}
            </p>
            <a 
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-foreground font-medium link-underline"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
