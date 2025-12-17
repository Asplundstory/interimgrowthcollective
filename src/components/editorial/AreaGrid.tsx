import { Area } from "@/content/areas";

interface AreaGridProps {
  areas: Area[];
}

export function AreaGrid({ areas }: AreaGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      {areas.map((area, index) => (
        <div 
          key={area.id} 
          className="fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
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
        </div>
      ))}
    </div>
  );
}
