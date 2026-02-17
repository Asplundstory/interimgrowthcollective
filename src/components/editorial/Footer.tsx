import { Link } from "react-router-dom";
import { siteConfig } from "@/content/site";
import { useLanguage } from "@/hooks/useLanguage";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, getLocalizedPath } = useLanguage();
  
  return (
    <footer className="border-t border-border py-12 md:py-16">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left side */}
          <div>
            <Link to={getLocalizedPath("/")} className="font-serif text-lg tracking-tight">
              {siteConfig.siteName}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>
          
          {/* Right side */}
          <div className="flex flex-col md:items-end gap-3">
            <a 
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {siteConfig.contactEmail}
            </a>
            <a 
              href={`tel:${siteConfig.phoneFormatted}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {siteConfig.phone}
            </a>
            
            <address className="not-italic text-xs text-muted-foreground mt-2">
              {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}
            </address>
            
            <div className="flex gap-6 text-sm text-muted-foreground mt-2">
              <Link to={getLocalizedPath("/press")} className="hover:text-foreground transition-colors">
                Press & Media
              </Link>
              <Link to={getLocalizedPath("/privacy")} className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link to={getLocalizedPath("/terms")} className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteConfig.siteName}. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground">
            {siteConfig.legalEntity.name} · Org.nr {siteConfig.legalEntity.orgNumber}
          </p>
        </div>
      </div>
    </footer>
  );
}
