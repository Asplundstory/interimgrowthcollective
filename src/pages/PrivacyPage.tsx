import { Hero, Section } from "@/components/editorial";
import { SEO } from "@/components/SEO";

export default function PrivacyPage() {
  return (
    <>
      <SEO 
        title="Integritetspolicy"
        description="Läs om hur Interim Growth Collective hanterar dina personuppgifter och skyddar din integritet enligt GDPR."
      />
      
      <Hero
        headline="Integritetspolicy"
        size="small"
      />
      
      <Section spacing="large">
        <article className="max-w-2xl space-y-8">
          <p className="text-muted-foreground leading-relaxed">
            Senast uppdaterad: 8 januari 2025
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Personuppgiftsansvarig</h2>
            <p className="text-muted-foreground leading-relaxed">
              Interim Growth Collective är personuppgiftsansvarig för behandlingen av dina personuppgifter 
              på denna webbplats. Vi värnar om din integritet och behandlar dina personuppgifter i enlighet 
              med EU:s dataskyddsförordning (GDPR) och övrig tillämplig lagstiftning.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Kontakt: <a href="mailto:hej@interimgrowthcollective.se" className="text-primary hover:underline">hej@interimgrowthcollective.se</a>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Vilka personuppgifter vi samlar in</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi samlar in följande typer av personuppgifter:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Kontaktformulär:</strong> Namn, e-postadress, företagsnamn och meddelande</li>
              <li><strong>Ansökan som kreatör:</strong> Namn, e-postadress, roll, portfolio-URL och svar på frågor</li>
              <li><strong>Cookies:</strong> Information om hur du använder vår webbplats (se avsnitt 5)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Varför vi behandlar dina uppgifter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi behandlar dina personuppgifter för följande ändamål:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Hantera och besvara förfrågningar via kontaktformuläret</li>
              <li>Hantera ansökningar från kreatörer som vill samarbeta med oss</li>
              <li>Förbättra webbplatsens funktionalitet och användarupplevelse</li>
              <li>Uppfylla rättsliga förpliktelser</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Rättslig grund:</strong> Behandlingen baseras på ditt samtycke (artikel 6.1.a GDPR) 
              när du skickar in ett formulär, samt vårt berättigade intresse (artikel 6.1.f GDPR) 
              att förbättra vår tjänst.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Hur länge vi sparar uppgifterna</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi sparar dina personuppgifter endast så länge det är nödvändigt för det ändamål de samlades in:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Kontaktförfrågningar:</strong> Upp till 12 månader efter avslutad kommunikation</li>
              <li><strong>Kreatöransökningar:</strong> Upp till 24 månader för eventuella framtida samarbeten</li>
              <li><strong>Cookies:</strong> Se avsnitt 5 för specifik lagringstid</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vår webbplats använder cookies för att förbättra din upplevelse. Vi ber om ditt samtycke 
              innan vi placerar icke-nödvändiga cookies.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Nödvändiga cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av. 
              De lagrar ditt cookie-samtycke.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Analyscookies (Google Analytics)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Om du ger ditt samtycke använder vi Google Analytics för att förstå hur besökare 
              interagerar med vår webbplats. Dessa cookies samlar in anonym statistik om besök, 
              sidvisningar och användarnas geografiska plats på aggregerad nivå.
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Leverantör:</strong> Google LLC</li>
              <li><strong>Lagringstid:</strong> Upp till 2 år</li>
              <li><strong>Dataöverföring:</strong> Data kan överföras till USA under Googles standardavtalsklausuler</li>
            </ul>
            
            <p className="text-muted-foreground leading-relaxed mt-4">
              Du kan när som helst återkalla ditt samtycke genom att rensa cookies i din webbläsare.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Delning av uppgifter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi säljer aldrig dina personuppgifter. Vi kan dela uppgifter med följande kategorier av mottagare:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Tjänsteleverantörer:</strong> Som hjälper oss att driva webbplatsen och hantera data (t.ex. värdtjänster)</li>
              <li><strong>Myndigheter:</strong> Om vi är skyldiga enligt lag</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Alla våra tjänsteleverantörer är bundna av avtal som säkerställer att de behandlar 
              dina uppgifter i enlighet med GDPR.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Dina rättigheter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Enligt GDPR har du följande rättigheter:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Rätt till tillgång:</strong> Du kan begära en kopia av dina personuppgifter</li>
              <li><strong>Rätt till rättelse:</strong> Du kan begära att felaktiga uppgifter korrigeras</li>
              <li><strong>Rätt till radering:</strong> Du kan begära att dina uppgifter raderas</li>
              <li><strong>Rätt till begränsning:</strong> Du kan begära att behandlingen begränsas</li>
              <li><strong>Rätt till dataportabilitet:</strong> Du kan begära att få dina uppgifter i ett maskinläsbart format</li>
              <li><strong>Rätt att invända:</strong> Du kan invända mot behandling baserad på berättigat intresse</li>
              <li><strong>Rätt att återkalla samtycke:</strong> Du kan när som helst återkalla ditt samtycke</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              För att utöva dina rättigheter, kontakta oss på{" "}
              <a href="mailto:hej@interimgrowthcollective.se" className="text-primary hover:underline">
                hej@interimgrowthcollective.se
              </a>.
              Vi besvarar din begäran inom 30 dagar.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Säkerhet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter 
              mot obehörig åtkomst, förlust eller förstörelse. Detta inkluderar krypterad dataöverföring (HTTPS), 
              säker datalagring och begränsad åtkomst till personuppgifter.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Ändringar i denna policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi kan uppdatera denna integritetspolicy vid behov. Väsentliga ändringar meddelas 
              på webbplatsen. Vi rekommenderar att du regelbundet granskar denna sida.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Klagomål</h2>
            <p className="text-muted-foreground leading-relaxed">
              Om du anser att vi behandlar dina personuppgifter i strid med GDPR har du rätt att 
              lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY):
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong>Integritetsskyddsmyndigheten</strong><br />
              Box 8114<br />
              104 20 Stockholm<br />
              <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.imy.se
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Har du frågor om hur vi hanterar dina personuppgifter? Kontakta oss på{" "}
              <a href="mailto:hej@interimgrowthcollective.se" className="text-primary hover:underline">
                hej@interimgrowthcollective.se
              </a>
            </p>
          </div>
        </article>
      </Section>
    </>
  );
}
