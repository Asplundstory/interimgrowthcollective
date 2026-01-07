"use client";

import { Hero, Section, ContactForm } from "@/components/editorial";
import { EditableText } from "@/components/cms";
import { useCmsContent } from "@/hooks/useCmsContent";
import { pageContent } from "@/content/pages";
import { siteConfig } from "@/content/site";
import defaultHeroImage from "@/assets/hero-contact.jpg";

const defaultContent = {
  ...pageContent.contact,
  heroImage: "",
};

export default function ContactPage() {
  const { content, isAdmin, updateField } = useCmsContent("contact", defaultContent);

  const heroImage = content.heroImage || defaultHeroImage;

  return (
    <>
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
      
      {/* Contact options */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Form */}
          <div>
            <ContactForm 
              submitText={content.form.submitText}
              successMessage={content.form.successMessage}
            />
          </div>
          
          {/* Direct contact */}
          <div className="md:pl-8">
            <EditableText
              value={content.directContact?.headline || "Direkt kontakt"}
              onSave={(v) => updateField("directContact.headline", v)}
              editable={isAdmin}
              tag="h2"
              className="font-serif text-xl text-editorial mb-4"
            />
            <EditableText
              value={content.directContact?.text || "Föredrar du att maila direkt? Skriv till oss så återkommer vi inom en arbetsdag."}
              onSave={(v) => updateField("directContact.text", v)}
              editable={isAdmin}
              tag="p"
              className="text-muted-foreground leading-relaxed mb-6"
            />
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
