import { Hero, Section } from "@/components/editorial";

export default function TermsPage() {
  return (
    <>
      <Hero 
        headline="Villkor"
        size="small"
      />
      
      <Section spacing="large">
        <article className="max-w-2xl">
          <p className="text-muted-foreground leading-relaxed mb-6">
            {/* TODO: Ersätt med faktiska villkor */}
            Den här sidan är under utveckling. Fullständiga villkor kommer att publiceras innan lansering.
          </p>
        </article>
      </Section>
    </>
  );
}
