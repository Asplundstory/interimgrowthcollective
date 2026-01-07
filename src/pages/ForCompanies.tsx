import { Hero, Section, SectionHeader, CTA } from "@/components/editorial";
import { usePageContent } from "@/hooks/usePageContent";
import heroCompaniesImage from "@/assets/hero-companies.jpg";

export default function ForCompaniesPage() {
  const { content } = usePageContent();
  const pageData = content.forCompanies;

  return (
    <>
      {/* Hero */}
      <Hero 
        headline={pageData.hero.headline}
        subheadline={pageData.hero.subheadline}
        size="medium"
        backgroundImage={heroCompaniesImage}
      />
      
      {/* Intro */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {pageData.intro.text}
          </p>
        </div>
      </Section>
      
      {/* Process */}
      <Section spacing="large">
        <SectionHeader 
          headline={pageData.process.headline}
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {pageData.process.steps.map((step, index) => (
            <div 
              key={step.title} 
              className="fade-in-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-label block mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-editorial">
                {step.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      
      {/* What we offer */}
      <Section background="card" spacing="large">
        <SectionHeader 
          headline="Vad vi erbjuder"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          <div>
            <h3 className="font-serif text-lg text-editorial">Interimslösningar</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Erfarna människor som kliver in och tar ansvar. Från några veckor till flera månader.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-editorial">Projektresurser</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Specialister för avgränsade projekt. När ni behöver specifik kompetens under begränsad tid.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-editorial">Strategiskt bollplank</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Erfarna rådgivare för komplexa beslut. Inte konsulter som producerar slides.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-editorial">Team extension</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Förstärkning av befintliga team. Sömlös integration med er organisation.
            </p>
          </div>
        </div>
      </Section>
      
      {/* CTA */}
      <CTA 
        headline={pageData.cta.headline}
        text={pageData.cta.text}
        buttonText={pageData.cta.buttonText}
        href="/contact"
        variant="subtle"
      />
    </>
  );
}
