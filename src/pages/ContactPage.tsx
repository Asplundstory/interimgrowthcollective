import { Hero, Section, ContactForm } from "@/components/editorial";
import { pageContent } from "@/content/pages";
import { siteConfig } from "@/content/site";

const content = pageContent.contact;

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Hero 
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        size="medium"
      />
      
      {/* Contact options */}
      <Section spacing="large">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Form */}
          <div>
            <ContactForm 
              submitText={content.form.submitText}
              successMessage={content.form.successMessage}
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
