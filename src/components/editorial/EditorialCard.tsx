import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface EditorialCardProps {
  title: string;
  description: string;
  href?: string;
  meta?: string;
  tags?: string[];
}

export function EditorialCard({ title, description, href, meta, tags }: EditorialCardProps) {
  const content = (
    <div className="group py-8 border-t border-border">
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
