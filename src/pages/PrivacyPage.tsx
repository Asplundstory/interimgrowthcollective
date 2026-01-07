import { Hero, Section } from "@/components/editorial";
import { SEO } from "@/components/SEO";

export default function PrivacyPage() {
  return (
    <>
      <SEO 
        title="Integritetspolicy"
        description="Läs om hur Interim Growth Collective hanterar dina personuppgifter och skyddar din integritet."
      />
      
      <Hero
        headline="Integritetspolicy"
        size="small"
      />
      
      <Section spacing="large">
        <article className="max-w-2xl prose prose-neutral">
          <p className="text-muted-foreground leading-relaxed mb-6">
            {/* TODO: Ersätt med faktisk integritetspolicy */}
            Den här sidan är under utveckling. Fullständig integritetspolicy kommer att publiceras innan lansering.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Interim Growth Collective värnar om din integritet. Vi samlar endast in information som är nödvändig 
            för att hantera förfrågningar och ansökningar. Vi delar aldrig dina uppgifter med tredje part utan ditt samtycke.
          </p>
        </article>
      </Section>
    </>
  );
}
