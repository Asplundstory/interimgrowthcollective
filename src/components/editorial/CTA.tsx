"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface CTAProps {
  headline: string;
  text?: string;
  buttonText: string;
  href: string;
  variant?: "default" | "subtle";
}

export function CTA({ headline, text, buttonText, href, variant = "default" }: CTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <div ref={ref} className={`py-16 md:py-24 ${variant === "subtle" ? "bg-muted" : "bg-card"}`}>
      <motion.div 
        className="container-editorial text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="font-serif text-editorial text-2xl md:text-3xl">
          {headline}
        </h2>
        
        {text && (
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            {text}
          </p>
        )}
        
        <div className="mt-8">
          <Link
            to={href}
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 hover:translate-y-[-2px]"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
