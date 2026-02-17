import { Hero, Section } from "@/components/editorial";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <>
      <SEO 
        title="Användarvillkor"
        description="Läs användarvillkoren för Interim Growth Collective webbplats och tjänster."
        breadcrumbs={[
          { name: "Hem", href: "/" },
          { name: "Användarvillkor", href: "/terms" },
        ]}
        noIndex
      />
      
      <Hero
        headline="Användarvillkor"
        size="small"
      />
      
      <Section spacing="large">
        <article className="max-w-2xl space-y-8">
          <p className="text-muted-foreground leading-relaxed">
            Senast uppdaterad: 8 januari 2025
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Allmänt</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dessa användarvillkor ("Villkor") gäller för din användning av webbplatsen 
              interimgrowthcollective.se ("Webbplatsen") som drivs av Interim Growth Collective ("vi", "oss", "vår").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Genom att använda Webbplatsen accepterar du dessa Villkor. Om du inte accepterar 
              Villkoren ber vi dig att inte använda Webbplatsen.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Tjänstebeskrivning</h2>
            <p className="text-muted-foreground leading-relaxed">
              Interim Growth Collective är ett nätverk av seniora interim-konsulter som erbjuder 
              tjänster inom strategi, kommunikation, marknadsföring och kreativt ledarskap. 
              Webbplatsen tillhandahåller information om våra tjänster samt möjlighet att kontakta 
              oss och ansöka om att bli del av vårt nätverk.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Användning av Webbplatsen</h2>
            <p className="text-muted-foreground leading-relaxed">
              Du förbinder dig att använda Webbplatsen i enlighet med dessa Villkor och tillämplig 
              lagstiftning. Du får inte:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Använda Webbplatsen på ett sätt som kan skada, inaktivera eller överbelasta den</li>
              <li>Försöka få obehörig åtkomst till Webbplatsens system eller nätverk</li>
              <li>Använda automatiserade system för att extrahera data från Webbplatsen</li>
              <li>Sprida skadlig kod, virus eller annan skadlig programvara</li>
              <li>Använda Webbplatsen för olagliga eller bedrägliga ändamål</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Kontaktformulär och ansökningar</h2>
            <p className="text-muted-foreground leading-relaxed">
              När du skickar in information via vårt kontaktformulär eller ansökningsformulär 
              garanterar du att:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Den information du lämnar är korrekt och fullständig</li>
              <li>Du har rätt att lämna den information du delar med oss</li>
              <li>Informationen inte kränker tredje parts rättigheter</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vi förbehåller oss rätten att inte besvara förfrågningar som vi bedömer vara 
              irrelevanta, stötande eller bedrägliga.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Immateriella rättigheter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Allt innehåll på Webbplatsen, inklusive men inte begränsat till text, grafik, logotyper, 
              bilder, och programvara, tillhör Interim Growth Collective eller våra licensgivare och 
              skyddas av upphovsrätt och andra immateriella rättigheter.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Du får inte kopiera, reproducera, distribuera, modifiera eller på annat sätt använda 
              innehållet utan vårt skriftliga tillstånd.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Personuppgifter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vår behandling av personuppgifter beskrivs i vår{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Integritetspolicy
              </Link>
              . Genom att använda Webbplatsen och skicka in information via formulär samtycker du 
              till behandlingen av dina personuppgifter enligt Integritetspolicyn.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Ansvarsbegränsning</h2>
            <p className="text-muted-foreground leading-relaxed">
              Webbplatsen och dess innehåll tillhandahålls "i befintligt skick" utan garantier av 
              något slag, varken uttryckliga eller underförstådda.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vi ansvarar inte för:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Tillfälliga avbrott eller fel i Webbplatsens funktion</li>
              <li>Förlust av data eller information som uppstår genom användning av Webbplatsen</li>
              <li>Skador som uppstår genom användning av information från Webbplatsen</li>
              <li>Tredjepartslänkar eller externa webbplatser vi kan hänvisa till</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vårt totala ansvar är under alla omständigheter begränsat till det belopp som är 
              tillåtet enligt tillämplig lag.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Länkar till tredje part</h2>
            <p className="text-muted-foreground leading-relaxed">
              Webbplatsen kan innehålla länkar till externa webbplatser som inte drivs av oss. 
              Vi har ingen kontroll över och tar inget ansvar för innehållet, integritetspolicyer 
              eller praxis på dessa webbplatser.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Ändringar av Villkoren</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi förbehåller oss rätten att när som helst ändra dessa Villkor. Väsentliga ändringar 
              träder i kraft 30 dagar efter publicering på Webbplatsen. Din fortsatta användning 
              av Webbplatsen efter sådana ändringar utgör ett godkännande av de uppdaterade Villkoren.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Avskiljbarhet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Om någon bestämmelse i dessa Villkor skulle anses ogiltig eller icke verkställbar, 
              ska övriga bestämmelser fortsätta att gälla i full utsträckning.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">11. Tillämplig lag och tvister</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dessa Villkor regleras av svensk lag. Eventuella tvister som uppstår i samband med 
              dessa Villkor ska i första hand lösas genom förhandling. Om parterna inte kan enas 
              ska tvisten avgöras av svensk allmän domstol med Stockholms tingsrätt som första instans.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">12. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              Om du har frågor om dessa Villkor är du välkommen att kontakta oss:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong>Interim Growth Collective</strong><br />
              E-post:{" "}
              <a href="mailto:hej@interimgrowthcollective.se" className="text-primary hover:underline">
                hej@interimgrowthcollective.se
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Läs även vår{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Integritetspolicy
              </Link>{" "}
              för information om hur vi hanterar dina personuppgifter.
            </p>
          </div>
        </article>
      </Section>
    </>
  );
}
