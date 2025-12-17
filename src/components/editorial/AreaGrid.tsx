"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Area } from "@/content/areas";

interface AreaGridProps {
  areas: Area[];
}

export function AreaGrid({ areas }: AreaGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-8 md:gap-12">
      {areas.map((area, index) => (
        <motion.div 
          key={area.id}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <h3 className="font-serif text-xl md:text-2xl text-editorial">
            {area.title}
          </h3>
          
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {area.description}
          </p>
          
          {area.examples.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {area.examples.map((example) => (
                <span 
                  key={example} 
                  className="text-xs text-muted-foreground border border-border px-2 py-1"
                >
                  {example}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
