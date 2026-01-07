// Page content
// TODO: Ersätt med faktiskt innehåll

export const pageContent = {
  home: {
    hero: {
      headline: "Människor med känsla. Handplockade för dig.",
      subheadline: "Interimslösningar inom varumärke, marknadsföring, kommunikation och koncept.",
      cta: "Boka samtal",
    },
    intro: {
      text: "Vi förmedlar erfarna människor till organisationer som behöver kompetens här och nu. Inte konsulter som levererar PowerPoints. Inte byråer som säljer kampanjpaket. Människor som kliver in och gör jobbet. Med ansvar. Med känsla.",
    },
    valueProposition: {
      headline: "Varför företag väljer oss",
      items: [
        {
          title: "Rätt person, inte bara tillgänglig person",
          description:
            "Vi presenterar inte kandidater vi inte själva skulle anlita. Varje person i vårt nätverk är handplockad och kvalitetssäkrad.",
        },
        {
          title: "Snabb leverans utan kompromiss",
          description:
            "När du behöver någon imorgon ska du inte behöva vänta. Men hastighet får aldrig gå före kvalitet.",
        },
        {
          title: "Fokus på känsla och kultur",
          description:
            "Kompetens är en hygienfaktor. Det som avgör är om personen passar in i er kultur och förstår er situation.",
        },
      ],
    },
  },

  forCompanies: {
    hero: {
      headline: "För företag som söker substans",
      subheadline: "Ni behöver inte fler slides. Ni behöver rätt person på rätt plats.",
    },
    intro: {
      text: "Vi förstår att ni har testat förut. Konsulter som lovar mycket och levererar PowerPoints. Byråer som säljer timmar istället för resultat. Det är inte vad vi erbjuder.",
    },
    process: {
      headline: "Så fungerar det",
      steps: [
        {
          title: "Samtal",
          description:
            "Vi börjar med att förstå ert behov. Inte bara vilken roll ni söker, utan vilket sammanhang personen ska verka i.",
        },
        {
          title: "Matchning",
          description:
            "Vi presenterar en till tre kandidater som vi bedömer passar er situation. Kvalitet före kvantitet.",
        },
        {
          title: "Uppstart",
          description: "När ni valt kliver personen in. Vi finns kvar som stöd under hela uppdraget.",
        },
      ],
    },
    offer: {
      headline: "Vad vi erbjuder",
      items: [
        { title: "Interimslösningar", description: "Erfarna människor som kliver in och tar ansvar. Från några veckor till flera månader." },
        { title: "Projektresurser", description: "Specialister för avgränsade projekt. När ni behöver specifik kompetens under begränsad tid." },
        { title: "Strategiskt bollplank", description: "Erfarna rådgivare för komplexa beslut. Inte konsulter som producerar slides." },
        { title: "Team extension", description: "Förstärkning av befintliga team. Sömlös integration med er organisation." },
      ],
    },
    cta: {
      headline: "Redo att börja",
      text: "Berätta om ert behov. Vi återkommer inom en arbetsdag.",
      buttonText: "Boka samtal",
    },
  },

  forCreators: {
    hero: {
      headline: "För kreatörer som levererar",
      subheadline: "Vi söker inte alla. Vi söker rätt personer.",
    },
    intro: {
      text: "Interim Growth Collective är ett nätverk av erfarna människor inom brand, marketing, kommunikation och kreativa discipliner. Vi tar inte in alla som ansöker. Vi letar efter människor med mognad, känsla för kvalitet och förmåga att leverera under press.",
    },
    expectations: {
      whatYouGet: {
        headline: "Vad du kan förvänta dig",
        items: [
          "Uppdrag som matchar din kompetens och dina preferenser",
          "Rättvis ersättning och transparenta villkor",
          "Stöd från oss under hela uppdraget",
          "Ett nätverk av likasinnade",
        ],
      },
      whatWeExpect: {
        headline: "Vad vi förväntar oss",
        items: [
          "Erfarenhet och mognad. Minst 8–10 år i relevant roll.",
          "Förmåga att leverera självständigt och ta ansvar",
          "Professionalism i varje interaktion",
          "Respekt för våra uppdragsgivares tid och förtroende",
        ],
      },
    },
    form: {
      headline: "Ansök om medlemskap",
      submitText: "Skicka ansökan",
      successMessage: "Tack för din ansökan. Vi går igenom alla ansökningar manuellt och återkommer inom två veckor.",
    },
  },

  about: {
    hero: {
      headline: "Om Interim Growth Collective",
      subheadline: "Vi byggde något vi själva hade velat ha.",
    },
    story: {
      text: `Interim Growth Collective startade ur en frustration. Vi hade arbetat på båda sidor: som de som behöver kompetens och som de som levererar. Och vi såg samma problem om och om igen.

Konsultvärlden är full av kompromisser. Byråer som prioriterar marginaler framför kvalitet. Konsultbolag som säljer juniora resurser till seniorpriser. Frilansnätverk utan urval.

Vi bestämde oss för att bygga något annorlunda. Ett nätverk där kvalitet inte är förhandlingsbart. Där varje person är handplockad. Där vi bara förmedlar människor vi själva skulle anlita.

Det är inte skalbart i traditionell mening. Men det var aldrig poängen.`,
    },
    values: {
      headline: "Vad vi tror på",
      items: [
        {
          title: "Kvalitet före kvantitet",
          description: "Vi säger nej oftare än vi säger ja. Det är så vi behåller förtroendet.",
        },
        {
          title: "Människor framför processer",
          description: "I slutändan handlar allt om människor. Rätt person i rätt sammanhang gör hela skillnaden.",
        },
        {
          title: "Ärlighet utan omskrivningar",
          description: "Vi säger vad vi tycker. Även när det är obekvämt. Särskilt då.",
        },
      ],
    },
  },

  contact: {
    hero: {
      headline: "Låt oss prata",
      subheadline: "Beskriv ert behov. Vi återkommer inom en arbetsdag.",
    },
    form: {
      submitText: "Skicka meddelande",
      successMessage: "Tack för ditt meddelande. Vi återkommer så snart vi kan.",
    },
    directContact: {
      headline: "Direkt kontakt",
      text: "Föredrar du att maila direkt? Skriv till oss så återkommer vi inom en arbetsdag.",
    },
  },
} as const;
