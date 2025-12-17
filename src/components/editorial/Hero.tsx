"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroProps {
  headline: string;
  subheadline?: string;
  cta?: {
    text: string;
    href: string;
  };
  size?: "large" | "medium" | "small";
}

export function Hero({ headline, subheadline, cta, size = "large" }: HeroProps) {
  return (
    <section className={`${size === "large" ? "py-24 md:py-32 lg:py-40" : size === "medium" ? "py-20 md:py-28" : "py-16 md:py-20"}`}>
      <div className="container-editorial">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className={`font-serif text-editorial ${
              size === "large" 
                ? "text-4xl md:text-5xl lg:text-6xl" 
                : size === "medium"
                ? "text-3xl md:text-4xl lg:text-5xl"
                : "text-2xl md:text-3xl lg:text-4xl"
            }`}
          >
            {headline}
          </motion.h1>
          
          {subheadline && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              {subheadline}
            </motion.p>
          )}
          
          {cta && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-8 md:mt-10"
            >
              <Link
                to={cta.href}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 hover:translate-y-[-2px]"
              >
                {cta.text}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
