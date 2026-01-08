"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ClientLogo {
  name: string;
  logoUrl: string;
  href?: string;
}

interface TrustSignalsProps {
  testimonials?: Testimonial[];
  clientLogos?: ClientLogo[];
  headline?: string;
  showPlaceholder?: boolean;
}

export function TrustSignals({ 
  testimonials = [], 
  clientLogos = [],
  headline,
  showPlaceholder = false,
}: TrustSignalsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Don't render anything if no content and placeholder is disabled
  if (!showPlaceholder && testimonials.length === 0 && clientLogos.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="space-y-16">
      {/* Testimonials */}
      {(testimonials.length > 0 || showPlaceholder) && (
        <div>
          {headline && (
            <h2 className="font-serif text-editorial text-2xl md:text-3xl mb-12 text-center">
              {headline}
            </h2>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="relative p-6 bg-card border border-border rounded-lg"
                >
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-muted-foreground/20" />
                  <p className="text-muted-foreground leading-relaxed mb-6 pt-6">
                    "{testimonial.quote}"
                  </p>
                  <footer className="border-t border-border pt-4">
                    <cite className="not-italic">
                      <span className="block font-medium text-foreground">
                        {testimonial.author}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </span>
                    </cite>
                  </footer>
                </motion.blockquote>
              ))
            ) : showPlaceholder ? (
              // Placeholder testimonials for preview
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="relative p-6 bg-muted/50 border border-dashed border-border rounded-lg"
                >
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-muted-foreground/10" />
                  <div className="pt-6 space-y-3">
                    <div className="h-4 bg-muted-foreground/10 rounded w-full" />
                    <div className="h-4 bg-muted-foreground/10 rounded w-5/6" />
                    <div className="h-4 bg-muted-foreground/10 rounded w-4/6" />
                  </div>
                  <div className="border-t border-border pt-4 mt-6">
                    <div className="h-4 bg-muted-foreground/10 rounded w-32 mb-2" />
                    <div className="h-3 bg-muted-foreground/10 rounded w-40" />
                  </div>
                </motion.div>
              ))
            ) : null}
          </div>
        </div>
      )}

      {/* Client Logos */}
      {(clientLogos.length > 0 || showPlaceholder) && (
        <div>
          <p className="text-label text-center mb-8">
            Trusted by
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.length > 0 ? (
              clientLogos.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  {client.href ? (
                    <a 
                      href={client.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                      <img 
                        src={client.logoUrl} 
                        alt={client.name} 
                        className="h-8 md:h-10 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <div className="grayscale opacity-60">
                      <img 
                        src={client.logoUrl} 
                        alt={client.name} 
                        className="h-8 md:h-10 w-auto object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              ))
            ) : showPlaceholder ? (
              // Placeholder logos
              Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                  }}
                  className="h-8 w-24 bg-muted-foreground/10 rounded"
                />
              ))
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage with sample data (can be used for testing)
export const sampleTestimonials: Testimonial[] = [
  {
    quote: "De förstod vårt varumärke på djupet och levererade resultat som överträffade våra förväntningar.",
    author: "Anna Lindberg",
    role: "CMO",
    company: "TechStartup AB",
  },
  {
    quote: "En interimkonsult som verkligen tog ansvar och drev förändring från dag ett.",
    author: "Erik Svensson",
    role: "VD",
    company: "Nordic Brand Co",
  },
  {
    quote: "Professionella, lyhörda och med en fantastisk känsla för kommunikation.",
    author: "Maria Karlsson",
    role: "Marknadschef",
    company: "Retail Group",
  },
];
