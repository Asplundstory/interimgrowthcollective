"use client";

import { Hero, Section, SectionHeader, CTA } from "@/components/editorial";
import { EditableText } from "@/components/cms";
import { SEO } from "@/components/SEO";
import { useCmsContent } from "@/hooks/useCmsContent";
import { pageContent } from "@/content/pages";
import defaultHeroImage from "@/assets/hero-companies.jpg";

const defaultContent = {
  ...pageContent.forCompanies,
  heroImage: "",
};

export default function ForCompaniesPage() {
  const { content, isAdmin, updateField } = useCmsContent("forCompanies", defaultContent);

  const heroImage = content.heroImage || defaultHeroImage;

  return (
    <>
      <SEO 
        title="För företag"
        description="Hitta erfarna interimresurser inom brand, marketing och kommunikation. Vi förmedlar människor som levererar från dag ett."
        breadcrumbs={[
          { name: "Hem", href: "/" },
          { name: "För företag", href: "/for-companies" },
        ]}
      />
      {/* Hero */}
      <Hero 
        headline={
          <EditableText
            value={content.hero.headline}
            onSave={(v) => updateField("hero.headline", v)}
            editable={isAdmin}
            tag="span"
          />
        }
        subheadline={
          <EditableText
            value={content.hero.subheadline}
            onSave={(v) => updateField("hero.subheadline", v)}
            editable={isAdmin}
            tag="span"
          />
        }
        size="medium"
        backgroundImage={heroImage}
        onImageChange={(url) => updateField("heroImage", url)}
        isAdmin={isAdmin}
      />
      
      {/* Intro */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <EditableText
            value={content.intro.text}
            onSave={(v) => updateField("intro.text", v)}
            editable={isAdmin}
            tag="p"
            className="text-lg leading-relaxed text-muted-foreground"
          />
        </div>
      </Section>
      
      {/* Process */}
      <Section spacing="large">
        <SectionHeader 
          headline={
            <EditableText
              value={content.process.headline}
              onSave={(v) => updateField("process.headline", v)}
              editable={isAdmin}
              tag="span"
            />
          }
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {content.process.steps.map((step, index) => (
            <div 
              key={index} 
              className="fade-in-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-label block mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              <EditableText
                value={step.title}
                onSave={(v) => updateField(`process.steps.${index}.title`, v)}
                editable={isAdmin}
                tag="h3"
                className="font-serif text-xl md:text-2xl text-editorial"
              />
              <EditableText
                value={step.description}
                onSave={(v) => updateField(`process.steps.${index}.description`, v)}
                editable={isAdmin}
                tag="p"
                className="mt-3 text-muted-foreground leading-relaxed"
              />
            </div>
          ))}
        </div>
      </Section>
      
      {/* What we offer */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline={
            <EditableText
              value={content.offer?.headline || "Vad vi erbjuder"}
              onSave={(v) => updateField("offer.headline", v)}
              editable={isAdmin}
              tag="span"
            />
          }
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          {(content.offer?.items || [
            { title: "Interimslösningar", description: "Erfarna människor som kliver in och tar ansvar. Från några veckor till flera månader." },
            { title: "Projektresurser", description: "Specialister för avgränsade projekt. När ni behöver specifik kompetens under begränsad tid." },
            { title: "Strategiskt bollplank", description: "Erfarna rådgivare för komplexa beslut. Inte konsulter som producerar slides." },
            { title: "Team extension", description: "Förstärkning av befintliga team. Sömlös integration med er organisation." }
          ]).map((item, index) => (
            <div key={index}>
              <EditableText
                value={item.title}
                onSave={(v) => updateField(`offer.items.${index}.title`, v)}
                editable={isAdmin}
                tag="h3"
                className="font-serif text-lg text-editorial"
              />
              <EditableText
                value={item.description}
                onSave={(v) => updateField(`offer.items.${index}.description`, v)}
                editable={isAdmin}
                tag="p"
                className="mt-2 text-muted-foreground text-sm leading-relaxed"
              />
            </div>
          ))}
        </div>
      </Section>
      
      {/* CTA */}
      <CTA 
        headline={content.cta.headline}
        text={content.cta.text}
        buttonText={content.cta.buttonText}
        href="/contact"
        variant="subtle"
      />
    </>
  );
}
