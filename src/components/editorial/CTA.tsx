import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  headline: string;
  text?: string;
  buttonText: string;
  href: string;
  variant?: "default" | "subtle";
}

export function CTA({ headline, text, buttonText, href, variant = "default" }: CTAProps) {
  return (
    <div className={`py-16 md:py-24 ${variant === "subtle" ? "bg-muted" : "bg-card"}`}>
      <div className="container-editorial text-center">
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
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
