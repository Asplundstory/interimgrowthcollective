"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Hero, Section, SectionHeader, EditorialCard, CTA, AreaGrid, FAQ, TrustSignals } from "@/components/editorial";
import { EditableText, TrustSignalsEditor } from "@/components/cms";
import { SEO } from "@/components/SEO";
import { useCmsContent } from "@/hooks/useCmsContent";
import { useInsights } from "@/hooks/useInsights";
import { useLanguage } from "@/hooks/useLanguage";
import { pageContent } from "@/content/pages";
import { areas } from "@/content/areas";
import { testimonials as staticTestimonials, testimonialsEn as staticTestimonialsEn, clientLogos as staticClientLogos } from "@/content/trustSignals";
import { useTrustSignals } from "@/hooks/useTrustSignals";
import defaultHeroImage from "@/assets/hero-architecture.jpg";

const defaultHomeContent = {
  ...pageContent.home,
  heroImage: "",
};

export default function HomePage() {
  const { content, isAdmin, updateField } = useCmsContent("home", defaultHomeContent);
  const { insights } = useInsights();
  const { t, getLocalizedPath, language } = useLanguage();
  
  const {
    testimonials: cmsTestimonials,
    clientLogos: cmsClientLogos,
    isLoading: trustSignalsLoading,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    createClientLogo,
    updateClientLogo,
    deleteClientLogo,
  } = useTrustSignals(language);
  
  // Use CMS data if available, otherwise fall back to static content
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : (language === "en" ? staticTestimonialsEn : staticTestimonials);
  const clientLogos = cmsClientLogos.length > 0 ? cmsClientLogos : staticClientLogos.map((l, i) => ({ ...l, id: `static-${i}` }));
  
  const valueRef = useRef(null);
  const isValueInView = useInView(valueRef, { once: true, margin: "-50px" });

  // Use uploaded image or fallback to default
  const heroImage = content.heroImage || defaultHeroImage;
  
  // FAQ data for structured data
  const faqData = [
    {
      question: t("faq.1.question"),
      answer: t("faq.1.answer"),
    },
    {
      question: t("faq.2.question"),
      answer: t("faq.2.answer"),
    },
    {
      question: t("faq.3.question"),
      answer: t("faq.3.answer"),
    },
    {
      question: t("faq.4.question"),
      answer: t("faq.4.answer"),
    },
  ];

  // Value proposition items
  const valueItems = [
    { title: t("home.value.1.title"), description: t("home.value.1.description") },
    { title: t("home.value.2.title"), description: t("home.value.2.description") },
    { title: t("home.value.3.title"), description: t("home.value.3.description") },
  ];

  return (
    <>
      <SEO faq={faqData} preloadImage={heroImage} />
      {/* Hero */}
      <Hero 
        headline={
          isAdmin ? (
            <EditableText
              value={content.hero.headline}
              onSave={(v) => updateField("hero.headline", v)}
              editable={isAdmin}
              tag="span"
            />
          ) : t("home.hero.headline")
        }
        subheadline={
          isAdmin ? (
            <EditableText
              value={content.hero.subheadline}
              onSave={(v) => updateField("hero.subheadline", v)}
              editable={isAdmin}
              tag="span"
            />
          ) : t("home.hero.subheadline")
        }
        cta={{ text: t("home.hero.cta"), href: getLocalizedPath("/contact") }}
        size="large"
        backgroundImage={heroImage}
        onImageChange={(url) => updateField("heroImage", url)}
        isAdmin={isAdmin}
      />
      
      {/* Intro */}
      <Section background="muted" spacing="large">
        <div className="max-w-2xl">
          {isAdmin ? (
            <EditableText
              value={content.intro.text}
              onSave={(v) => updateField("intro.text", v)}
              editable={isAdmin}
              tag="p"
              className="text-lg md:text-xl leading-relaxed text-muted-foreground"
            />
          ) : (
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              {t("home.intro.text")}
            </p>
          )}
        </div>
      </Section>
      
      {/* Value Proposition */}
      <Section spacing="large">
        <SectionHeader 
          headline={t("home.value.headline")}
        />
        <div ref={valueRef} className="grid md:grid-cols-3 gap-8 md:gap-12">
          {valueItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isValueInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <h3 className="font-serif text-lg md:text-xl text-editorial">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Trust Signals - Testimonials */}
      <Section spacing="large">
        <SectionHeader 
          label={language === "en" ? "Testimonials" : "Vad våra kunder säger"}
          headline={language === "en" ? "Trusted by leading brands" : "Förtroende från ledande varumärken"}
        />
        {isAdmin && (
          <div className="mb-6">
            <TrustSignalsEditor
              testimonials={cmsTestimonials}
              clientLogos={cmsClientLogos}
              onCreateTestimonial={createTestimonial}
              onUpdateTestimonial={updateTestimonial}
              onDeleteTestimonial={deleteTestimonial}
              onCreateClientLogo={createClientLogo}
              onUpdateClientLogo={updateClientLogo}
              onDeleteClientLogo={deleteClientLogo}
            />
          </div>
        )}
        <TrustSignals 
          testimonials={testimonials}
          clientLogos={clientLogos}
        />
      </Section>
      
      {/* Areas preview */}
      <Section background="card" spacing="large">
        <SectionHeader 
          label={t("home.areas.label")}
          headline={t("home.areas.headline")}
        />
        <AreaGrid areas={areas.slice(0, 4)} />
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to={getLocalizedPath("/areas")} 
            className="text-sm font-medium link-underline"
          >
            {t("home.areas.seeAll")}
          </Link>
        </motion.div>
      </Section>
      
      {/* Latest insights */}
      <Section spacing="large">
        <SectionHeader 
          label={t("home.insights.label")}
          headline={t("home.insights.headline")}
        />
        <div className="space-y-0" role="list" aria-label={t("home.insights.headline")}>
          {insights.filter(p => p.published).slice(0, 3).map((post, index) => (
            <EditorialCard
              key={post.slug}
              title={post.title}
              description={post.excerpt}
              href={getLocalizedPath(`/insights/${post.slug}`)}
              meta={new Date(post.date).toLocaleDateString(language === "en" ? 'en-US' : 'sv-SE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              tags={post.tags}
              index={index}
            />
          ))}
        </div>
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to={getLocalizedPath("/insights")} 
            className="text-sm font-medium link-underline"
          >
            {t("home.insights.seeAll")}
          </Link>
        </motion.div>
      </Section>
      
      {/* FAQ */}
      <Section background="muted" spacing="large">
        <SectionHeader 
          headline={t("home.faq.headline")}
          label={t("home.faq.label")}
        />
        <FAQ items={faqData} />
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
