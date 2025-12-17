import { Link } from "react-router-dom";
import { siteConfig } from "@/content/site";

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
          <h1 
            className={`font-serif text-editorial fade-in-up ${
              size === "large" 
                ? "text-4xl md:text-5xl lg:text-6xl" 
                : size === "medium"
                ? "text-3xl md:text-4xl lg:text-5xl"
                : "text-2xl md:text-3xl lg:text-4xl"
            }`}
          >
            {headline}
          </h1>
          
          {subheadline && (
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed fade-in-up stagger-1">
              {subheadline}
            </p>
          )}
          
          {cta && (
            <div className="mt-8 md:mt-10 fade-in-up stagger-2">
              <Link
                to={cta.href}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
              >
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
