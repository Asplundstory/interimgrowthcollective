// Areas / Disciplines content
// TODO: Ersätt med faktiskt innehåll

import areaBrandImage from "@/assets/area-brand.jpg";
import areaMarketingImage from "@/assets/area-marketing.jpg";
import areaCommunicationImage from "@/assets/area-communication.jpg";
import areaCreativeImage from "@/assets/area-creative.jpg";

export interface Area {
  id: string;
  title: string;
  description: string;
  examples: string[];
  image: string;
}

export const areas: Area[] = [
  {
    id: "brand",
    title: "Brand",
    description: "Strategiskt varumärkesarbete. Positionering, identitet och narrativ. Vi förmedlar människor som förstår att varumärke inte är en logotyp utan en känsla.",
    examples: ["Brand Strategy", "Brand Identity", "Brand Guidelines", "Tone of Voice"],
    image: areaBrandImage,
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Marknadsföring med substans. Inte leadgen-fabriker utan genomtänkta insatser som bygger långsiktigt värde.",
    examples: ["Marketing Strategy", "Content Strategy", "Campaign Planning", "Marketing Operations"],
    image: areaMarketingImage,
  },
  {
    id: "communication",
    title: "Kommunikation",
    description: "Extern och intern kommunikation. Människor som kan skriva, redigera och tänka strategiskt om hur budskap landar.",
    examples: ["Corporate Communication", "PR", "Internal Communication", "Crisis Communication"],
    image: areaCommunicationImage,
  },
  {
    id: "creative",
    title: "Kreativa discipliner",
    description: "Design, arkitektur, inredning, musik, film. Kreatörer som förstår både hantverket och affären.",
    examples: ["Art Direction", "Graphic Design", "Interior Design", "Architecture", "Music Production", "Film Production"],
    image: areaCreativeImage,
  },
];
