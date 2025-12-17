import { Link } from "react-router-dom";
import { Hero, Section, SectionHeader, EditorialCard, CTA, AreaGrid } from "@/components/editorial";
import { pageContent } from "@/content/pages";
import { areas } from "@/content/areas";
import { insights } from "@/content/insights";

const content = pageContent.home;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero 
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        cta={{ text: content.hero.cta, href: "/contact" }}
        size="large"
      />
      
      {/* Intro */}
      <Section background="muted" spacing="large">
        <div className="max-w-2xl">
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            {content.intro.text}
          </p>
        </div>
      </Section>
      
      {/* Value Proposition */}
      <Section spacing="large">
        <SectionHeader 
          headline={content.valueProposition.headline}
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {content.valueProposition.items.map((item, index) => (
            <div 
              key={item.title} 
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-serif text-lg md:text-xl text-editorial">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      
      {/* Areas preview */}
      <Section background="card" spacing="large">
        <SectionHeader 
          label="Områden"
          headline="Var vi gör skillnad"
        />
        <AreaGrid areas={areas.slice(0, 4)} />
        <div className="mt-12">
          <Link 
            to="/areas" 
            className="text-sm font-medium link-underline"
          >
            Se alla områden
          </Link>
        </div>
      </Section>
      
      {/* Latest insights */}
      <Section spacing="large">
        <SectionHeader 
          label="Insights"
          headline="Senaste tankarna"
        />
        <div className="space-y-0">
          {insights.slice(0, 3).map((post) => (
            <EditorialCard
              key={post.slug}
              title={post.title}
              description={post.excerpt}
              href={`/insights/${post.slug}`}
              meta={new Date(post.date).toLocaleDateString('sv-SE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              tags={post.tags}
            />
          ))}
        </div>
        <div className="mt-8">
          <Link 
            to="/insights" 
            className="text-sm font-medium link-underline"
          >
            Alla inlägg
          </Link>
        </div>
      </Section>
      
      {/* CTA */}
      <CTA 
        headline="Redo att börja"
        text="Berätta om ert behov. Vi återkommer inom en arbetsdag."
        buttonText="Boka samtal"
        href="/contact"
        variant="subtle"
      />
    </>
  );
}
