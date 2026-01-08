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
        preloadImage={defaultHeroImage}
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
            
            <div className="space-y-3 mb-8">
              <a 
                href={`mailto:${siteConfig.contactEmail}`}
                className="block text-foreground font-medium link-underline"
              >
                {siteConfig.contactEmail}
              </a>
              <a 
                href={`tel:${siteConfig.phoneFormatted}`}
                className="block text-foreground font-medium link-underline"
              >
                {siteConfig.phone}
              </a>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="font-serif text-lg mb-3">
                {language === "en" ? "Address" : "Adress"}
              </h3>
              <address className="not-italic text-muted-foreground leading-relaxed">
                {siteConfig.address.street}<br />
                {siteConfig.address.postalCode} {siteConfig.address.city}<br />
                {siteConfig.address.country}
              </address>
            </div>
            
            <div className="pt-6 mt-6 border-t border-border">
              <h3 className="font-serif text-lg mb-3">
                {language === "en" ? "Company info" : "Företagsinformation"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {siteConfig.legalEntity.note}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Org.nr: {siteConfig.legalEntity.orgNumber}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
