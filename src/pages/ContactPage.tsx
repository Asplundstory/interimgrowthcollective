import { Hero, Section, ContactForm } from "@/components/editorial";
import { usePageContent } from "@/hooks/usePageContent";
import { siteConfig } from "@/content/site";
import heroContactImage from "@/assets/hero-contact.jpg";

export default function ContactPage() {
  const { content } = usePageContent();
  const pageData = content.contact;

  return (
    <>
      {/* Hero */}
      <Hero 
        headline={pageData.hero.headline}
        subheadline={pageData.hero.subheadline}
        size="medium"
        backgroundImage={heroContactImage}
      />
      
      {/* Contact options */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Form */}
          <div>
            <ContactForm 
              submitText={pageData.form.submitText}
              successMessage={pageData.form.successMessage}
            />
          </div>
          
          {/* Direct contact */}
          <div className="md:pl-8">
            <h2 className="font-serif text-xl text-editorial mb-4">
              Direkt kontakt
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Föredrar du att maila direkt? Skriv till oss så återkommer vi inom en arbetsdag.
            </p>
            <a 
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-foreground font-medium link-underline"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
