"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "card";
  spacing?: "default" | "large" | "small";
  id?: string;
  animate?: boolean;
}

export function Section({ 
  children, 
  className = "", 
  background = "default",
  spacing = "default",
  id,
  animate = true,
}: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const bgClass = {
    default: "bg-background",
    muted: "bg-muted",
    card: "bg-card",
  }[background];
  
  const spacingClass = {
    default: "py-16 md:py-24",
    large: "py-20 md:py-32",
    small: "py-12 md:py-16",
  }[spacing];
  
  if (!animate) {
    return (
      <section id={id} className={`${bgClass} ${spacingClass} ${className}`}>
        <div className="container-editorial">
          {children}
        </div>
      </section>
    );
  }
  
  return (
    <section id={id} ref={ref} className={`${bgClass} ${spacingClass} ${className}`}>
      <motion.div 
        className="container-editorial"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

interface SectionHeaderProps {
  label?: string;
  headline: ReactNode;
  description?: ReactNode;
}

export function SectionHeader({ label, headline, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 md:mb-16">
      {label && (
        <span className="text-label block mb-4">{label}</span>
      )}
      <h2 className="font-serif text-editorial text-2xl md:text-3xl lg:text-4xl">
        {headline}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
