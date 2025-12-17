"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Hero, Section, SectionHeader, EditorialCard, CTA, AreaGrid } from "@/components/editorial";
import { pageContent } from "@/content/pages";
import { areas } from "@/content/areas";
import { insights } from "@/content/insights";

const content = pageContent.home;

export default function HomePage() {
  const valueRef = useRef(null);
  const isValueInView = useInView(valueRef, { once: true, margin: "-50px" });
  
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
        <div ref={valueRef} className="grid md:grid-cols-3 gap-8 md:gap-12">
          {content.valueProposition.items.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isValueInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <h3 className="font-serif text-lg md:text-xl text-editorial">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
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
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/areas" 
            className="text-sm font-medium link-underline"
          >
            Se alla områden
          </Link>
        </motion.div>
      </Section>
      
      {/* Latest insights */}
      <Section spacing="large">
        <SectionHeader 
          label="Insights"
          headline="Senaste tankarna"
        />
        <div className="space-y-0">
          {insights.slice(0, 3).map((post, index) => (
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
              index={index}
            />
          ))}
        </div>
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/insights" 
            className="text-sm font-medium link-underline"
          >
            Alla inlägg
          </Link>
        </motion.div>
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
