"use client";

import { useRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface EditorialCardProps {
  title: string;
  description: string;
  href?: string;
  meta?: ReactNode;
  tags?: string[];
  index?: number;
  image?: string | null;
}

export function EditorialCard({ title, description, href, meta, tags, index = 0, image }: EditorialCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const content = (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group py-8 border-t border-border"
    >
      <div className={image ? "flex flex-col md:flex-row gap-6" : ""}>
        {image && (
          <div className="md:w-48 flex-shrink-0">
            <div className="aspect-video md:aspect-[4/3] rounded-md overflow-hidden bg-muted">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        )}
        <div className="flex-1">
          {meta && (
            <span className="text-label block mb-3">{meta}</span>
          )}
          
          <h3 className="font-serif text-xl md:text-2xl text-editorial group-hover:text-accent transition-colors">
            {title}
          </h3>
          
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {href && (
            <div className="mt-4 flex items-center text-sm font-medium group-hover:text-accent transition-colors">
              Läs mer
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }
  
  return content;
}
