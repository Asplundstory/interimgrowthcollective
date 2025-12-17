import { Hero, Section, SectionHeader, CreatorForm } from "@/components/editorial";
import { pageContent } from "@/content/pages";

const content = pageContent.forCreators;

export default function ForCreatorsPage() {
  return (
    <>
      {/* Hero */}
      <Hero 
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        size="medium"
      />
      
      {/* Intro */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {content.intro.text}
          </p>
        </div>
      </Section>
      
      {/* Expectations */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* What you get */}
          <div className="fade-in-up">
            <SectionHeader 
              headline={content.expectations.whatYouGet.headline}
            />
            <ul className="space-y-4">
              {content.expectations.whatYouGet.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* What we expect */}
          <div className="fade-in-up stagger-1">
            <SectionHeader 
              headline={content.expectations.whatWeExpect.headline}
            />
            <ul className="space-y-4">
              {content.expectations.whatWeExpect.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
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
          headline={content.form.headline}
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
