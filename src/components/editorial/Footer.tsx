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
          <div className="flex flex-col md:items-end gap-4">
            <a 
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {siteConfig.contactEmail}
            </a>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to={getLocalizedPath("/privacy")} className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link to={getLocalizedPath("/terms")} className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteConfig.siteName}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
