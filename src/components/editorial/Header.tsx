import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { siteConfig } from "@/content/site";
import { useNavigation } from "@/hooks/useNavigation";
import { useLanguage } from "@/hooks/useLanguage";
import { MenuEditor } from "@/components/cms";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const location = useLocation();
  const { items: navigation, isAdmin, updateNavigation } = useNavigation();
  const { t, getLocalizedPath, language } = useLanguage();

  // Localized navigation
  const localizedNav = [
    { name: t("nav.forCompanies"), href: getLocalizedPath("/for-companies") },
    { name: t("nav.forCreators"), href: getLocalizedPath("/for-creators") },
    { name: t("nav.areas"), href: getLocalizedPath("/areas") },
    { name: t("nav.insights"), href: getLocalizedPath("/insights") },
    { name: t("nav.about"), href: getLocalizedPath("/about") },
  ];

  const isActive = (href: string) => {
    const currentPath = location.pathname;
    const basePath = language === "en" ? currentPath.replace(/^\/en/, "") || "/" : currentPath;
    const targetPath = language === "en" ? href.replace(/^\/en/, "") || "/" : href;
    return basePath === targetPath;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to={getLocalizedPath("/")} className="font-serif text-lg md:text-xl tracking-tight">
              {siteConfig.siteName}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {localizedNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm transition-colors ${
                    isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <button
                  onClick={() => setShowMenuEditor(true)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title={t("nav.editMenu")}
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}
            </nav>

            {/* CTA + Language + Mobile menu button */}
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              
              <Link
                to={getLocalizedPath("/contact")}
                className="hidden md:inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
              >
                {t("nav.bookCall")}
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 -mr-2"
                aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden py-6 border-t border-border">
              <div className="flex flex-col gap-4">
                {localizedNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base py-2 transition-colors ${
                      isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowMenuEditor(true);
                    }}
                    className="flex items-center gap-2 text-base py-2 text-muted-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    {t("nav.editMenu")}
                  </button>
                )}
                <Link
                  to={getLocalizedPath("/contact")}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex justify-center mt-4 px-4 py-3 bg-primary text-primary-foreground text-sm font-medium"
                >
                  {t("nav.bookCall")}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Menu Editor Modal */}
      {showMenuEditor && (
        <MenuEditor
          items={navigation}
          onSave={updateNavigation}
          onClose={() => setShowMenuEditor(false)}
        />
      )}
    </>
  );
}
