import { Link } from "react-router-dom";
import { siteConfig } from "@/content/site";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-12 md:py-16">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left side */}
          <div>
            <Link to="/" className="font-serif text-lg tracking-tight">
              {siteConfig.siteName}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>
          
          {/* Right side */}
          <div className="flex flex-col md:items-end gap-4">
            <a 
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {siteConfig.contactEmail}
            </a>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Integritetspolicy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Villkor
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteConfig.siteName}. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
