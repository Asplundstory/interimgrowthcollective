import { Header } from "@/components/editorial/Header";
import { Footer } from "@/components/editorial/Footer";
import { CandidateApplicationForm } from "@/components/candidates";
import { SEO } from "@/components/SEO";

export default function ApplyPage() {
  return (
    <>
      <SEO 
        title="Ansök - Interim Growth Collective"
        description="Ansök för att bli en del av IGC:s nätverk av erfarna konsulter."
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bli en del av IGC
              </h1>
              <p className="text-lg text-muted-foreground">
                Vi söker alltid efter talangfulla konsulter som delar vår passion för 
                att leverera värde och bygga långsiktiga relationer.
              </p>
            </div>
            <CandidateApplicationForm />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
