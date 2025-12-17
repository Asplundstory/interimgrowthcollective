// Areas / Disciplines content
// TODO: Ersätt med faktiskt innehåll

export interface Area {
  id: string;
  title: string;
  description: string;
  examples: string[];
}

export const areas: Area[] = [
  {
    id: "brand",
    title: "Brand",
    description: "Strategiskt varumärkesarbete. Positionering, identitet och narrativ. Vi förmedlar människor som förstår att varumärke inte är en logotyp utan en känsla.",
    examples: ["Brand Strategy", "Brand Identity", "Brand Guidelines", "Tone of Voice"],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Marknadsföring med substans. Inte leadgen-fabriker utan genomtänkta insatser som bygger långsiktigt värde.",
    examples: ["Marketing Strategy", "Content Strategy", "Campaign Planning", "Marketing Operations"],
  },
  {
    id: "communication",
    title: "Kommunikation",
    description: "Extern och intern kommunikation. Människor som kan skriva, redigera och tänka strategiskt om hur budskap landar.",
    examples: ["Corporate Communication", "PR", "Internal Communication", "Crisis Communication"],
  },
  {
    id: "creative",
    title: "Kreativa discipliner",
    description: "Design, arkitektur, inredning, musik, film. Kreatörer som förstår både hantverket och affären.",
    examples: ["Art Direction", "Graphic Design", "Interior Design", "Architecture", "Music Production", "Film Production"],
  },
];
