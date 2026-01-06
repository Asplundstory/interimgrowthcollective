import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/content/site";

const navigation = [
  { name: "För företag", href: "/for-companies" },
  { name: "För yrkespersoner", href: "/for-creators" },
  { name: "Områden", href: "/areas" },
  { name: "Om oss", href: "/about" },
  { name: "Inspiration", href: "/insights" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="font-serif text-lg md:text-xl tracking-tight">
            {siteConfig.siteName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm transition-colors ${
                  location.pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile menu button */}
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden md:inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
            >
              Boka samtal
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2"
              aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-6 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base py-2 transition-colors ${
                    location.pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex justify-center mt-4 px-4 py-3 bg-primary text-primary-foreground text-sm font-medium"
              >
                Boka samtal
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
