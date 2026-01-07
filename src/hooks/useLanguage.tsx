import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Language = "sv" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  sv: {
    // Navigation
    "nav.forCompanies": "För företag",
    "nav.forCreators": "För kreatörer",
    "nav.areas": "Områden",
    "nav.insights": "Insights",
    "nav.about": "Om oss",
    "nav.contact": "Kontakt",
    "nav.bookCall": "Boka samtal",
    "nav.editMenu": "Redigera meny",
    "nav.openMenu": "Öppna meny",
    "nav.closeMenu": "Stäng meny",
    
    // Home
    "home.hero.headline": "Människor med känsla. Handplockade för dig.",
    "home.hero.subheadline": "Interimslösningar inom varumärke, marknadsföring, kommunikation och koncept.",
    "home.hero.cta": "Boka samtal",
    "home.intro.text": "Vi förmedlar erfarna människor till organisationer som behöver kompetens här och nu. Inte konsulter som levererar PowerPoints. Inte byråer som säljer kampanjpaket. Människor som kliver in och gör jobbet. Med ansvar. Med känsla.",
    "home.value.headline": "Varför företag väljer oss",
    "home.value.1.title": "Rätt person, inte bara tillgänglig person",
    "home.value.1.description": "Vi presenterar inte kandidater vi inte själva skulle anlita. Varje person i vårt nätverk är handplockad och kvalitetssäkrad.",
    "home.value.2.title": "Snabb leverans utan kompromiss",
    "home.value.2.description": "När du behöver någon imorgon ska du inte behöva vänta. Men hastighet får aldrig gå före kvalitet.",
    "home.value.3.title": "Fokus på känsla och kultur",
    "home.value.3.description": "Kompetens är en hygienfaktor. Det som avgör är om personen passar in i er kultur och förstår er situation.",
    "home.areas.label": "Områden",
    "home.areas.headline": "Var vi gör skillnad",
    "home.areas.seeAll": "Se alla områden",
    "home.insights.label": "Insights",
    "home.insights.headline": "Senaste tankarna",
    "home.insights.seeAll": "Alla inlägg",
    "home.cta.headline": "Redo att börja",
    "home.cta.text": "Berätta om ert behov. Vi återkommer inom en arbetsdag.",
    "home.cta.button": "Boka samtal",
    "home.faq.label": "FAQ",
    "home.faq.headline": "Vanliga frågor",
    
    // FAQ
    "faq.1.question": "Vad är en interimkonsult?",
    "faq.1.answer": "En interimkonsult är en erfaren specialist som tillfälligt förstärker er organisation. Till skillnad från traditionella konsulter kliver interimkonsulter in och tar operativt ansvar - de levererar resultat, inte rapporter.",
    "faq.2.question": "Inom vilka områden förmedlar ni interimkonsulter?",
    "faq.2.answer": "Vi förmedlar erfarna människor inom brand strategy, marketing, kommunikation och kreativa discipliner som design, arkitektur, inredning, musik och film.",
    "faq.3.question": "Hur snabbt kan ni hitta rätt person?",
    "faq.3.answer": "Vanligtvis presenterar vi kvalificerade kandidater inom 1-2 veckor. Vid akuta behov kan vi ofta agera snabbare tack vare vårt etablerade nätverk.",
    "faq.4.question": "Vad kostar det att anlita en interimkonsult via er?",
    "faq.4.answer": "Priserna varierar beroende på uppdragets längd, komplexitet och den kompetens som krävs. Kontakta oss för en offert baserad på ert specifika behov.",
    
    // For Companies
    "companies.hero.headline": "För företag som söker substans",
    "companies.hero.subheadline": "Ni behöver inte fler slides. Ni behöver rätt person på rätt plats.",
    "companies.intro.text": "Vi förstår att ni har testat förut. Konsulter som lovar mycket och levererar PowerPoints. Byråer som säljer timmar istället för resultat. Det är inte vad vi erbjuder.",
    "companies.process.headline": "Så fungerar det",
    "companies.process.1.title": "Samtal",
    "companies.process.1.description": "Vi börjar med att förstå ert behov. Inte bara vilken roll ni söker, utan vilket sammanhang personen ska verka i.",
    "companies.process.2.title": "Matchning",
    "companies.process.2.description": "Vi presenterar en till tre kandidater som vi bedömer passar er situation. Kvalitet före kvantitet.",
    "companies.process.3.title": "Uppstart",
    "companies.process.3.description": "När ni valt kliver personen in. Vi finns kvar som stöd under hela uppdraget.",
    "companies.offer.headline": "Vad vi erbjuder",
    "companies.offer.1.title": "Interimslösningar",
    "companies.offer.1.description": "Erfarna människor som kliver in och tar ansvar. Från några veckor till flera månader.",
    "companies.offer.2.title": "Projektresurser",
    "companies.offer.2.description": "Specialister för avgränsade projekt. När ni behöver specifik kompetens under begränsad tid.",
    "companies.offer.3.title": "Strategiskt bollplank",
    "companies.offer.3.description": "Erfarna rådgivare för komplexa beslut. Inte konsulter som producerar slides.",
    "companies.offer.4.title": "Team extension",
    "companies.offer.4.description": "Förstärkning av befintliga team. Sömlös integration med er organisation.",
    "companies.faq.headline": "Vanliga frågor för företag",
    "companies.faq.1.question": "Hur skiljer sig en interimkonsult från en traditionell konsult?",
    "companies.faq.1.answer": "En interimkonsult tar operativt ansvar och arbetar som en del av er organisation. Traditionella konsulter levererar ofta analyser och rekommendationer, medan interimkonsulter kliver in och genomför förändringen.",
    "companies.faq.2.question": "Hur lång tid tar det att hitta rätt kandidat?",
    "companies.faq.2.answer": "Vi presenterar vanligtvis kvalificerade kandidater inom 1-2 veckor. Vid akuta behov kan vi ofta agera snabbare tack vare vårt etablerade nätverk av handplockade specialister.",
    "companies.faq.3.question": "Vad händer om det inte blir en bra match?",
    "companies.faq.3.answer": "Vi står bakom varje rekommendation. Om matchningen inte fungerar arbetar vi snabbt för att hitta en ersättare. Vårt rykte bygger på att leverera rätt person, inte bara en person.",
    
    // For Creators
    "creators.hero.headline": "För kreatörer som levererar",
    "creators.hero.subheadline": "Vi söker inte alla. Vi söker rätt personer.",
    "creators.intro.text": "Interim Growth Collective är ett nätverk av erfarna människor inom brand, marketing, kommunikation och kreativa discipliner. Vi tar inte in alla som ansöker. Vi letar efter människor med mognad, känsla för kvalitet och förmåga att leverera under press.",
    "creators.whatYouGet.headline": "Vad du kan förvänta dig",
    "creators.whatYouGet.1": "Uppdrag som matchar din kompetens och dina preferenser",
    "creators.whatYouGet.2": "Rättvis ersättning och transparenta villkor",
    "creators.whatYouGet.3": "Stöd från oss under hela uppdraget",
    "creators.whatYouGet.4": "Ett nätverk av likasinnade",
    "creators.whatWeExpect.headline": "Vad vi förväntar oss",
    "creators.whatWeExpect.1": "Erfarenhet och mognad. Minst 8–10 år i relevant roll.",
    "creators.whatWeExpect.2": "Förmåga att leverera självständigt och ta ansvar",
    "creators.whatWeExpect.3": "Professionalism i varje interaktion",
    "creators.whatWeExpect.4": "Respekt för våra uppdragsgivares tid och förtroende",
    "creators.form.headline": "Ansök om medlemskap",
    "creators.form.submit": "Skicka ansökan",
    "creators.form.success": "Tack för din ansökan. Vi går igenom alla ansökningar manuellt och återkommer inom två veckor.",
    "creators.faq.headline": "Vanliga frågor för kreatörer",
    "creators.faq.1.question": "Vad krävs för att bli en del av nätverket?",
    "creators.faq.1.answer": "Vi söker erfarna specialister med minst 8-10 år i relevant roll. Du bör kunna arbeta självständigt, leverera under press och dela våra värderingar kring kvalitet och professionalism.",
    "creators.faq.2.question": "Hur fungerar uppdragsfördelningen?",
    "creators.faq.2.answer": "Vi matchar uppdrag baserat på din kompetens, erfarenhet och tillgänglighet. Du väljer själv vilka uppdrag du tackar ja till - det finns inget krav på att ta alla erbjudanden.",
    "creators.faq.3.question": "Vilken ersättning kan jag förvänta mig?",
    "creators.faq.3.answer": "Vi tror på rättvis ersättning som reflekterar din erfarenhet och uppdragets komplexitet. Villkoren är alltid transparenta och förhandlas inför varje uppdrag.",
    
    // About
    "about.hero.headline": "Om Interim Growth Collective",
    "about.hero.subheadline": "Vi byggde något vi själva hade velat ha.",
    "about.story.text": "Interim Growth Collective startade ur en frustration. Vi hade arbetat på båda sidor: som de som behöver kompetens och som de som levererar. Och vi såg samma problem om och om igen.\n\nKonsultvärlden är full av kompromisser. Byråer som prioriterar marginaler framför kvalitet. Konsultbolag som säljer juniora resurser till seniorpriser. Frilansnätverk utan urval.\n\nVi bestämde oss för att bygga något annorlunda. Ett nätverk där kvalitet inte är förhandlingsbart. Där varje person är handplockad. Där vi bara förmedlar människor vi själva skulle anlita.\n\nDet är inte skalbart i traditionell mening. Men det var aldrig poängen.",
    "about.values.headline": "Vad vi tror på",
    "about.values.1.title": "Kvalitet före kvantitet",
    "about.values.1.description": "Vi säger nej oftare än vi säger ja. Det är så vi behåller förtroendet.",
    "about.values.2.title": "Människor framför processer",
    "about.values.2.description": "I slutändan handlar allt om människor. Rätt person i rätt sammanhang gör hela skillnaden.",
    "about.values.3.title": "Ärlighet utan omskrivningar",
    "about.values.3.description": "Vi säger vad vi tycker. Även när det är obekvämt. Särskilt då.",
    
    // Contact
    "contact.hero.headline": "Låt oss prata",
    "contact.hero.subheadline": "Beskriv ert behov. Vi återkommer inom en arbetsdag.",
    "contact.form.name": "Namn",
    "contact.form.email": "E-post",
    "contact.form.company": "Företag",
    "contact.form.message": "Meddelande",
    "contact.form.submit": "Skicka meddelande",
    "contact.form.success": "Tack för ditt meddelande. Vi återkommer så snart vi kan.",
    "contact.direct.headline": "Direkt kontakt",
    "contact.direct.text": "Föredrar du att maila direkt? Skriv till oss så återkommer vi inom en arbetsdag.",
    
    // Areas
    "areas.hero.headline": "Våra områden",
    "areas.hero.subheadline": "Vi förmedlar erfarna människor inom dessa discipliner.",
    "areas.brand.title": "Brand",
    "areas.brand.description": "Strategiskt varumärkesarbete. Positionering, identitet och narrativ. Vi förmedlar människor som förstår att varumärke inte är en logotyp utan en känsla.",
    "areas.marketing.title": "Marketing",
    "areas.marketing.description": "Marknadsföring med substans. Inte leadgen-fabriker utan genomtänkta insatser som bygger långsiktigt värde.",
    "areas.communication.title": "Kommunikation",
    "areas.communication.description": "Extern och intern kommunikation. Människor som kan skriva, redigera och tänka strategiskt om hur budskap landar.",
    "areas.creative.title": "Kreativa discipliner",
    "areas.creative.description": "Design, arkitektur, inredning, musik, film. Kreatörer som förstår både hantverket och affären.",
    
    // Insights
    "insights.hero.headline": "Insights",
    "insights.hero.subheadline": "Tankar och perspektiv från vårt nätverk.",
    "insights.empty": "Inga artiklar publicerade ännu.",
    "insights.newArticle": "Ny artikel",
    "insights.draft": "Utkast",
    
    // Areas page
    "areas.context.1": "Vi begränsar oss medvetet till områden där vi har djup kompetens och ett starkt nätverk. Varje person i vårt collective har valts ut baserat på erfarenhet, mognad och förmåga att leverera under press.",
    "areas.context.2": "Om ni behöver kompetens inom ett område som inte listas här, hör gärna av er. Vi kan ofta hjälpa till eller peka i rätt riktning.",
    
    // Form labels
    "form.name": "Namn",
    "form.email": "E-post",
    "form.company": "Företag",
    "form.message": "Meddelande",
    "form.messagePlaceholder": "Beskriv ert behov...",
    "form.role": "Roll / Disciplin",
    "form.rolePlaceholder": "t.ex. Brand Strategist, Art Director",
    "form.portfolio": "Länk till portfolio eller LinkedIn",
    "form.sending": "Skickar...",
    "form.errorTitle": "Något gick fel",
    "form.errorDescription": "Försök igen eller kontakta oss direkt via e-post.",
    "form.q1": "Beskriv ett uppdrag där känslan avgjorde kvaliteten i leveransen.",
    "form.q2": "Hur skapar du struktur utan att döda kreativitet?",
    "form.q3": "Vad behöver du för att leverera stabilt under press?",
    "form.codeOfConduct": "Jag bekräftar att jag har läst och accepterar Interim Growth Collectives Code of Conduct.",
    "form.reviewNote": "Alla ansökningar granskas manuellt. Vi letar efter människor som delar våra värderingar kring kvalitet och ansvar.",
    
    // Footer
    "footer.description": "Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner.",
    "footer.navigation": "Navigation",
    "footer.legal": "Juridiskt",
    "footer.privacy": "Integritetspolicy",
    "footer.terms": "Användarvillkor",
    "footer.contact": "Kontakt",
    "footer.rights": "Alla rättigheter förbehållna.",
    
    // Common
    "common.readMore": "Läs mer",
    "common.loading": "Laddar...",
    "common.error": "Något gick fel",
    "common.notFound": "Sidan kunde inte hittas",
    "common.goHome": "Gå till startsidan",
  },
  en: {
    // Navigation
    "nav.forCompanies": "For Companies",
    "nav.forCreators": "For Creators",
    "nav.areas": "Areas",
    "nav.insights": "Insights",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.bookCall": "Book a Call",
    "nav.editMenu": "Edit menu",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    
    // Home
    "home.hero.headline": "People with passion. Hand-picked for you.",
    "home.hero.subheadline": "Interim solutions in brand, marketing, communication and creative disciplines.",
    "home.hero.cta": "Book a Call",
    "home.intro.text": "We connect experienced professionals with organizations that need expertise right now. Not consultants delivering PowerPoints. Not agencies selling campaign packages. People who step in and get the job done. With accountability. With passion.",
    "home.value.headline": "Why companies choose us",
    "home.value.1.title": "The right person, not just an available person",
    "home.value.1.description": "We don't present candidates we wouldn't hire ourselves. Every person in our network is hand-picked and vetted.",
    "home.value.2.title": "Fast delivery without compromise",
    "home.value.2.description": "When you need someone tomorrow, you shouldn't have to wait. But speed should never come before quality.",
    "home.value.3.title": "Focus on fit and culture",
    "home.value.3.description": "Competence is a given. What matters is whether the person fits your culture and understands your situation.",
    "home.areas.label": "Areas",
    "home.areas.headline": "Where we make a difference",
    "home.areas.seeAll": "See all areas",
    "home.insights.label": "Insights",
    "home.insights.headline": "Latest thoughts",
    "home.insights.seeAll": "All posts",
    "home.cta.headline": "Ready to start",
    "home.cta.text": "Tell us about your needs. We'll get back to you within one business day.",
    "home.cta.button": "Book a Call",
    "home.faq.label": "FAQ",
    "home.faq.headline": "Frequently Asked Questions",
    
    // FAQ
    "faq.1.question": "What is an interim consultant?",
    "faq.1.answer": "An interim consultant is an experienced specialist who temporarily strengthens your organization. Unlike traditional consultants, interim consultants step in and take operational responsibility - they deliver results, not reports.",
    "faq.2.question": "In which areas do you provide interim consultants?",
    "faq.2.answer": "We provide experienced professionals in brand strategy, marketing, communication and creative disciplines such as design, architecture, interior design, music and film.",
    "faq.3.question": "How quickly can you find the right person?",
    "faq.3.answer": "We typically present qualified candidates within 1-2 weeks. For urgent needs, we can often act faster thanks to our established network.",
    "faq.4.question": "What does it cost to hire an interim consultant through you?",
    "faq.4.answer": "Prices vary depending on the assignment's length, complexity and the expertise required. Contact us for a quote based on your specific needs.",
    
    // For Companies
    "companies.hero.headline": "For companies seeking substance",
    "companies.hero.subheadline": "You don't need more slides. You need the right person in the right place.",
    "companies.intro.text": "We understand you've tried before. Consultants who promise a lot and deliver PowerPoints. Agencies that sell hours instead of results. That's not what we offer.",
    "companies.process.headline": "How it works",
    "companies.process.1.title": "Conversation",
    "companies.process.1.description": "We start by understanding your needs. Not just which role you're looking for, but the context in which the person will operate.",
    "companies.process.2.title": "Matching",
    "companies.process.2.description": "We present one to three candidates we believe fit your situation. Quality over quantity.",
    "companies.process.3.title": "Onboarding",
    "companies.process.3.description": "Once you've chosen, the person steps in. We remain available for support throughout the assignment.",
    "companies.offer.headline": "What we offer",
    "companies.offer.1.title": "Interim solutions",
    "companies.offer.1.description": "Experienced people who step in and take responsibility. From a few weeks to several months.",
    "companies.offer.2.title": "Project resources",
    "companies.offer.2.description": "Specialists for defined projects. When you need specific expertise for a limited time.",
    "companies.offer.3.title": "Strategic sounding board",
    "companies.offer.3.description": "Experienced advisors for complex decisions. Not consultants who produce slides.",
    "companies.offer.4.title": "Team extension",
    "companies.offer.4.description": "Strengthening existing teams. Seamless integration with your organization.",
    "companies.faq.headline": "FAQ for Companies",
    "companies.faq.1.question": "How does an interim consultant differ from a traditional consultant?",
    "companies.faq.1.answer": "An interim consultant takes operational responsibility and works as part of your organization. Traditional consultants often deliver analyses and recommendations, while interim consultants step in and execute the change.",
    "companies.faq.2.question": "How long does it take to find the right candidate?",
    "companies.faq.2.answer": "We typically present qualified candidates within 1-2 weeks. For urgent needs, we can often act faster thanks to our established network of hand-picked specialists.",
    "companies.faq.3.question": "What happens if it's not a good match?",
    "companies.faq.3.answer": "We stand behind every recommendation. If the match doesn't work, we work quickly to find a replacement. Our reputation is built on delivering the right person, not just any person.",
    
    // For Creators
    "creators.hero.headline": "For creators who deliver",
    "creators.hero.subheadline": "We don't look for everyone. We look for the right people.",
    "creators.intro.text": "Interim Growth Collective is a network of experienced professionals in brand, marketing, communication and creative disciplines. We don't accept everyone who applies. We look for people with maturity, a sense of quality and the ability to deliver under pressure.",
    "creators.whatYouGet.headline": "What you can expect",
    "creators.whatYouGet.1": "Assignments that match your skills and preferences",
    "creators.whatYouGet.2": "Fair compensation and transparent terms",
    "creators.whatYouGet.3": "Support from us throughout the assignment",
    "creators.whatYouGet.4": "A network of like-minded professionals",
    "creators.whatWeExpect.headline": "What we expect",
    "creators.whatWeExpect.1": "Experience and maturity. At least 8-10 years in a relevant role.",
    "creators.whatWeExpect.2": "Ability to deliver independently and take responsibility",
    "creators.whatWeExpect.3": "Professionalism in every interaction",
    "creators.whatWeExpect.4": "Respect for our clients' time and trust",
    "creators.form.headline": "Apply for membership",
    "creators.form.submit": "Submit application",
    "creators.form.success": "Thank you for your application. We review all applications manually and will get back to you within two weeks.",
    "creators.faq.headline": "FAQ for Creators",
    "creators.faq.1.question": "What does it take to join the network?",
    "creators.faq.1.answer": "We look for experienced specialists with at least 8-10 years in a relevant role. You should be able to work independently, deliver under pressure and share our values around quality and professionalism.",
    "creators.faq.2.question": "How does assignment distribution work?",
    "creators.faq.2.answer": "We match assignments based on your expertise, experience and availability. You choose which assignments to accept - there's no requirement to take all offers.",
    "creators.faq.3.question": "What compensation can I expect?",
    "creators.faq.3.answer": "We believe in fair compensation that reflects your experience and the assignment's complexity. Terms are always transparent and negotiated before each assignment.",
    
    // About
    "about.hero.headline": "About Interim Growth Collective",
    "about.hero.subheadline": "We built something we ourselves would have wanted.",
    "about.story.text": "Interim Growth Collective started from frustration. We had worked on both sides: as those who need expertise and as those who deliver. And we saw the same problems over and over again.\n\nThe consulting world is full of compromises. Agencies that prioritize margins over quality. Consulting firms that sell junior resources at senior prices. Freelance networks without selection.\n\nWe decided to build something different. A network where quality is non-negotiable. Where every person is hand-picked. Where we only connect people we would hire ourselves.\n\nIt's not scalable in the traditional sense. But that was never the point.",
    "about.values.headline": "What we believe in",
    "about.values.1.title": "Quality over quantity",
    "about.values.1.description": "We say no more often than we say yes. That's how we maintain trust.",
    "about.values.2.title": "People over processes",
    "about.values.2.description": "In the end, it's all about people. The right person in the right context makes all the difference.",
    "about.values.3.title": "Honesty without euphemisms",
    "about.values.3.description": "We say what we think. Even when it's uncomfortable. Especially then.",
    
    // Contact
    "contact.hero.headline": "Let's talk",
    "contact.hero.subheadline": "Describe your needs. We'll get back to you within one business day.",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.company": "Company",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.form.success": "Thank you for your message. We'll get back to you as soon as possible.",
    "contact.direct.headline": "Direct contact",
    "contact.direct.text": "Prefer to email directly? Write to us and we'll get back to you within one business day.",
    
    // Areas
    "areas.hero.headline": "Our areas",
    "areas.hero.subheadline": "We connect experienced professionals in these disciplines.",
    "areas.brand.title": "Brand",
    "areas.brand.description": "Strategic brand work. Positioning, identity and narrative. We connect people who understand that a brand is not a logo but a feeling.",
    "areas.marketing.title": "Marketing",
    "areas.marketing.description": "Marketing with substance. Not lead-gen factories but thoughtful efforts that build long-term value.",
    "areas.communication.title": "Communication",
    "areas.communication.description": "External and internal communication. People who can write, edit and think strategically about how messages land.",
    "areas.creative.title": "Creative disciplines",
    "areas.creative.description": "Design, architecture, interior design, music, film. Creatives who understand both the craft and the business.",
    
    // Insights
    "insights.hero.headline": "Insights",
    "insights.hero.subheadline": "Thoughts and perspectives from our network.",
    "insights.empty": "No articles published yet.",
    "insights.newArticle": "New article",
    "insights.draft": "Draft",
    
    // Areas page
    "areas.context.1": "We deliberately limit ourselves to areas where we have deep expertise and a strong network. Every person in our collective has been selected based on experience, maturity and ability to deliver under pressure.",
    "areas.context.2": "If you need expertise in an area not listed here, please get in touch. We can often help or point you in the right direction.",
    
    // Form labels
    "form.name": "Name",
    "form.email": "Email",
    "form.company": "Company",
    "form.message": "Message",
    "form.messagePlaceholder": "Describe your needs...",
    "form.role": "Role / Discipline",
    "form.rolePlaceholder": "e.g. Brand Strategist, Art Director",
    "form.portfolio": "Link to portfolio or LinkedIn",
    "form.sending": "Sending...",
    "form.errorTitle": "Something went wrong",
    "form.errorDescription": "Please try again or contact us directly by email.",
    "form.q1": "Describe an assignment where feeling determined the quality of the delivery.",
    "form.q2": "How do you create structure without killing creativity?",
    "form.q3": "What do you need to deliver steadily under pressure?",
    "form.codeOfConduct": "I confirm that I have read and accept the Interim Growth Collective Code of Conduct.",
    "form.reviewNote": "All applications are reviewed manually. We look for people who share our values of quality and responsibility.",
    
    // Footer
    "footer.description": "Interim solutions in brand, marketing, communication and creative disciplines.",
    "footer.navigation": "Navigation",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    
    // Common
    "common.readMore": "Read more",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.notFound": "Page not found",
    "common.goHome": "Go to homepage",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine language from URL
  const getLanguageFromPath = (pathname: string): Language => {
    return pathname.startsWith("/en") ? "en" : "sv";
  };
  
  const [language, setLanguageState] = useState<Language>(() => 
    getLanguageFromPath(location.pathname)
  );

  // Update language when URL changes
  useEffect(() => {
    const newLang = getLanguageFromPath(location.pathname);
    if (newLang !== language) {
      setLanguageState(newLang);
    }
  }, [location.pathname, language]);

  const setLanguage = (lang: Language) => {
    const currentPath = location.pathname;
    let newPath: string;
    
    if (lang === "en") {
      // Switch to English
      if (currentPath.startsWith("/en")) {
        newPath = currentPath; // Already English
      } else {
        newPath = `/en${currentPath === "/" ? "" : currentPath}`;
      }
    } else {
      // Switch to Swedish
      if (currentPath.startsWith("/en")) {
        newPath = currentPath.replace(/^\/en/, "") || "/";
      } else {
        newPath = currentPath; // Already Swedish
      }
    }
    
    navigate(newPath);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const getLocalizedPath = (path: string): string => {
    if (language === "en") {
      return path === "/" ? "/en" : `/en${path}`;
    }
    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
