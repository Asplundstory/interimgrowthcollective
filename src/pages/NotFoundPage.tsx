import { Link } from "react-router-dom";
import { Hero, Section } from "@/components/editorial";

export default function NotFoundPage() {
  return (
    <>
      <Hero 
        headline="404"
        subheadline="Sidan du letar efter finns inte."
        size="small"
      />
      
      <Section spacing="default">
        <Link 
          to="/" 
          className="text-sm font-medium link-underline"
        >
          Tillbaka till startsidan
        </Link>
      </Section>
    </>
  );
}
