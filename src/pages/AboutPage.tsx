import { Hero, Section, SectionHeader } from "@/components/editorial";
import { pageContent } from "@/content/pages";

const content = pageContent.about;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Hero 
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        size="medium"
      />
      
      {/* Story */}
      <Section spacing="large">
        <div className="max-w-2xl">
          {content.story.text.split('\n\n').map((paragraph, index) => (
            <p 
              key={index} 
              className="text-muted-foreground leading-relaxed mb-6 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>
      
      {/* Values */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline={content.values.headline}
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {content.values.items.map((value, index) => (
            <div 
              key={value.title} 
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-serif text-lg md:text-xl text-editorial">
                {value.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
