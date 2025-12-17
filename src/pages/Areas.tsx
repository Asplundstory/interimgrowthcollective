import { Hero, Section, AreaGrid } from "@/components/editorial";
import { areas } from "@/content/areas";

export default function AreasPage() {
  return (
    <>
      {/* Hero */}
      <Hero 
        headline="Områden"
        subheadline="Vi förmedlar erfarna människor inom brand, marketing, kommunikation och kreativa discipliner."
        size="medium"
      />
      
      {/* Areas */}
      <Section spacing="large">
        <AreaGrid areas={areas} />
      </Section>
      
      {/* Additional context */}
      <Section background="muted" spacing="default">
        <div className="max-w-2xl">
          <p className="text-muted-foreground leading-relaxed">
            Vi begränsar oss medvetet till områden där vi har djup kompetens och ett starkt nätverk. 
            Varje person i vårt collective har valts ut baserat på erfarenhet, mognad och förmåga att leverera under press.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Om ni behöver kompetens inom ett område som inte listas här, hör gärna av er. 
            Vi kan ofta hjälpa till eller peka i rätt riktning.
          </p>
        </div>
      </Section>
    </>
  );
}
