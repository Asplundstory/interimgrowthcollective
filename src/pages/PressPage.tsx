import { SEO } from "@/components/SEO";
import { Hero, Section } from "@/components/editorial";
import { useLanguage } from "@/hooks/useLanguage";
import { siteConfig } from "@/content/site";
import { Download, Mail, Phone, ExternalLink } from "lucide-react";

export default function PressPage() {
  const { language, getLocalizedPath } = useLanguage();
  const isSv = language === "sv";

  const pressKitSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.siteName,
    url: "https://interimgrowthcollective.se",
    logo: "https://interimgrowthcollective.se/favicon.png",
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    email: siteConfig.contactEmail,
    telephone: siteConfig.phoneFormatted,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    sameAs: [siteConfig.social.linkedin],
  };

  return (
    <>
      <SEO
        title={isSv ? "Press & Media" : "Press & Media"}
        description={
          isSv
            ? "Pressmaterial, logotyper och kontaktuppgifter för media. Interim Growth Collective — interimslösningar inom brand, marketing och kommunikation."
            : "Press materials, logos and media contact information. Interim Growth Collective — interim solutions in brand, marketing and communication."
        }
        breadcrumbs={[
          { name: isSv ? "Hem" : "Home", href: getLocalizedPath("/") },
          { name: "Press & Media", href: getLocalizedPath("/press") },
        ]}
      />

      {/* Inject NewsMediaOrganization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressKitSchema) }}
      />

      <Hero
        headline="Press & Media"
        subheadline={
          isSv
            ? "Material och kontaktuppgifter för journalister och media"
            : "Materials and contact details for journalists and media"
        }
        size="medium"
      />

      {/* About section */}
      <Section spacing="large">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">
            {isSv ? "Om Interim Growth Collective" : "About Interim Growth Collective"}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {isSv
                ? "Interim Growth Collective är ett nätverk av handplockade interimkonsulter inom varumärke, marknadsföring, kommunikation och kreativa discipliner. Vi grundades 2024 med visionen att förändra hur organisationer hittar och engagerar senior kompetens."
                : "Interim Growth Collective is a curated network of handpicked interim consultants in brand, marketing, communication and creative disciplines. Founded in 2024 with the vision of transforming how organizations find and engage senior talent."}
            </p>
            <p>
              {isSv
                ? "Vi matchar rätt person till rätt uppdrag — människor med känsla, erfarenhet och driv. Vårt nätverk består av seniora specialister som har arbetat med ledande varumärken i Skandinavien."
                : "We match the right person to the right assignment — people with empathy, experience and drive. Our network consists of senior specialists who have worked with leading brands across Scandinavia."}
            </p>
          </div>
        </div>
      </Section>

      {/* Key facts */}
      <Section spacing="default">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">
            {isSv ? "Snabbfakta" : "Key Facts"}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: isSv ? "Grundat" : "Founded", value: "2024" },
              { label: isSv ? "Huvudkontor" : "Headquarters", value: "Stockholm, Sverige" },
              {
                label: isSv ? "Kompetensområden" : "Areas of Expertise",
                value: "Brand, Marketing, Communication, Creative",
              },
              {
                label: isSv ? "Juridisk enhet" : "Legal Entity",
                value: `${siteConfig.legalEntity.name} (${siteConfig.legalEntity.orgNumber})`,
              },
            ].map((fact) => (
              <div key={fact.label} className="border-l-2 border-border pl-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Logos & assets */}
      <Section spacing="default">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">
            {isSv ? "Logotyp & visuellt material" : "Logo & Visual Assets"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSv
              ? "Ladda ner vår logotyp i olika format. Vänligen använd logotypen oförändrad och på tillräckligt kontrasterande bakgrund."
              : "Download our logo in various formats. Please use the logo unaltered and on a sufficiently contrasting background."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/favicon.png"
              download="igc-logo.png"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-md text-sm hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              {isSv ? "Logotyp (PNG)" : "Logo (PNG)"}
            </a>
            <a
              href="/og-image.png"
              download="igc-og-image.png"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-md text-sm hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              {isSv ? "OG-bild (PNG)" : "OG Image (PNG)"}
            </a>
          </div>
        </div>
      </Section>

      {/* Media contact */}
      <Section spacing="default">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">
            {isSv ? "Presskontakt" : "Media Contact"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSv
              ? "För pressförfrågningar, intervjuer och kommentarer — kontakta oss:"
              : "For press inquiries, interviews and comments — contact us:"}
          </p>
          <div className="space-y-3">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {siteConfig.contactEmail}
            </a>
            <a
              href={`tel:${siteConfig.phoneFormatted}`}
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {siteConfig.phone}
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              LinkedIn
            </a>
          </div>
        </div>
      </Section>

      {/* Case studies CTA */}
      <Section spacing="large">
        <div className="max-w-3xl border-t border-border pt-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            {isSv ? "Case Studies" : "Case Studies"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSv
              ? "Läs om hur vi har hjälpt organisationer att stärka sin kapacitet inom brand, marketing och kommunikation."
              : "Read about how we've helped organizations strengthen their capacity in brand, marketing and communication."}
          </p>
          <a
            href={getLocalizedPath("/insights?tag=case-study")}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors underline underline-offset-4"
          >
            {isSv ? "Se alla case studies →" : "View all case studies →"}
          </a>
        </div>
      </Section>
    </>
  );
}
