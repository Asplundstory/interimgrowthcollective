"use client";

import { Hero, Section, SectionHeader } from "@/components/editorial";
import { EditableText } from "@/components/cms";
import { useCmsContent } from "@/hooks/useCmsContent";
import { pageContent } from "@/content/pages";
import defaultHeroImage from "@/assets/hero-about.jpg";

const defaultContent = {
  ...pageContent.about,
  heroImage: "",
};

export default function AboutPage() {
  const { content, isAdmin, updateField } = useCmsContent("about", defaultContent);

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
      
      {/* Story */}
      <Section spacing="large">
        <div className="max-w-2xl">
          <EditableText
            value={content.story.text}
            onSave={(v) => updateField("story.text", v)}
            editable={isAdmin}
            tag="p"
            className="text-muted-foreground leading-relaxed whitespace-pre-line"
          />
        </div>
      </Section>
      
      {/* Values */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline={
            <EditableText
              value={content.values.headline}
              onSave={(v) => updateField("values.headline", v)}
              editable={isAdmin}
              tag="span"
            />
          }
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {content.values.items.map((value, index) => (
            <div 
              key={index} 
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EditableText
                value={value.title}
                onSave={(v) => updateField(`values.items.${index}.title`, v)}
                editable={isAdmin}
                tag="h3"
                className="font-serif text-lg md:text-xl text-editorial"
              />
              <EditableText
                value={value.description}
                onSave={(v) => updateField(`values.items.${index}.description`, v)}
                editable={isAdmin}
                tag="p"
                className="mt-3 text-muted-foreground leading-relaxed"
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
