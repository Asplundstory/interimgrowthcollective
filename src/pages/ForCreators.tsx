"use client";

import { Hero, Section, SectionHeader, CreatorForm } from "@/components/editorial";
import { EditableText } from "@/components/cms";
import { SEO } from "@/components/SEO";
import { useCmsContent } from "@/hooks/useCmsContent";
import { pageContent } from "@/content/pages";
import defaultHeroImage from "@/assets/hero-creators.jpg";

const defaultContent = {
  ...pageContent.forCreators,
  heroImage: "",
};

export default function ForCreatorsPage() {
  const { content, isAdmin, updateField } = useCmsContent("forCreators", defaultContent);

  const heroImage = content.heroImage || defaultHeroImage;

  return (
    <>
      <SEO 
        title="För kreatörer"
        description="Gå med i Interim Growth Collective. Vi söker erfarna strateger, designers och kommunikatörer som vill arbeta med spännande uppdrag."
        breadcrumbs={[
          { name: "Hem", href: "/" },
          { name: "För kreatörer", href: "/for-creators" },
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
      
      {/* Expectations */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* What you get */}
          <div className="fade-in-up">
            <SectionHeader 
              headline={
                <EditableText
                  value={content.expectations.whatYouGet.headline}
                  onSave={(v) => updateField("expectations.whatYouGet.headline", v)}
                  editable={isAdmin}
                  tag="span"
                />
              }
            />
            <ul className="space-y-4">
              {content.expectations.whatYouGet.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  <EditableText
                    value={item}
                    onSave={(v) => updateField(`expectations.whatYouGet.items.${index}`, v)}
                    editable={isAdmin}
                    tag="span"
                    className="text-muted-foreground"
                  />
                </li>
              ))}
            </ul>
          </div>
          
          {/* What we expect */}
          <div className="fade-in-up stagger-1">
            <SectionHeader 
              headline={
                <EditableText
                  value={content.expectations.whatWeExpect.headline}
                  onSave={(v) => updateField("expectations.whatWeExpect.headline", v)}
                  editable={isAdmin}
                  tag="span"
                />
              }
            />
            <ul className="space-y-4">
              {content.expectations.whatWeExpect.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  <EditableText
                    value={item}
                    onSave={(v) => updateField(`expectations.whatWeExpect.items.${index}`, v)}
                    editable={isAdmin}
                    tag="span"
                    className="text-muted-foreground"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      
      {/* Application Form */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline={
            <EditableText
              value={content.form.headline}
              onSave={(v) => updateField("form.headline", v)}
              editable={isAdmin}
              tag="span"
            />
          }
          description="Alla ansökningar granskas manuellt. Vi letar efter människor som delar våra värderingar kring kvalitet och ansvar."
        />
        <div className="max-w-2xl">
          <CreatorForm 
            submitText={content.form.submitText}
            successMessage={content.form.successMessage}
          />
        </div>
      </Section>
    </>
  );
}
