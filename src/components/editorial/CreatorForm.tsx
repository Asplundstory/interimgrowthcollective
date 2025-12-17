import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreatorFormProps {
  submitText?: string;
  successMessage?: string;
}

export function CreatorForm({ 
  submitText = "Skicka ansökan", 
  successMessage = "Tack för din ansökan. Vi går igenom alla ansökningar manuellt och återkommer inom två veckor."
}: CreatorFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeOfConduct, setCodeOfConduct] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeOfConduct) return;
    
    setIsSubmitting(true);
    
    // Simulate submission (UI only, no backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };
  
  if (isSubmitted) {
    return (
      <div className="py-12 text-center border border-border bg-card">
        <p className="text-lg font-serif px-6">{successMessage}</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Namn</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-background border-border"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">Roll / Disciplin</Label>
            <Input 
              id="role" 
              name="role" 
              required 
              placeholder="t.ex. Brand Strategist, Art Director"
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio">Länk till portfolio eller LinkedIn</Label>
            <Input 
              id="portfolio" 
              name="portfolio" 
              type="url" 
              required 
              placeholder="https://"
              className="bg-background border-border"
            />
          </div>
        </div>
      </div>
      
      {/* Questions */}
      <div className="space-y-6 pt-4 border-t border-border">
        <div className="space-y-2">
          <Label htmlFor="q1" className="text-base">
            Beskriv ett uppdrag där känslan avgjorde kvaliteten i leveransen.
          </Label>
          <Textarea 
            id="q1" 
            name="q1" 
            rows={4} 
            required 
            className="bg-background border-border resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="q2" className="text-base">
            Hur skapar du struktur utan att döda kreativitet?
          </Label>
          <Textarea 
            id="q2" 
            name="q2" 
            rows={4} 
            required 
            className="bg-background border-border resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="q3" className="text-base">
            Vad behöver du för att leverera stabilt under press?
          </Label>
          <Textarea 
            id="q3" 
            name="q3" 
            rows={4} 
            required 
            className="bg-background border-border resize-none"
          />
        </div>
      </div>
      
      {/* Code of Conduct */}
      <div className="flex items-start space-x-3 pt-4 border-t border-border">
        <Checkbox 
          id="coc" 
          checked={codeOfConduct}
          onCheckedChange={(checked) => setCodeOfConduct(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="coc" className="text-sm text-muted-foreground font-normal cursor-pointer">
          Jag bekräftar att jag har läst och accepterar Interim Growth Collectives Code of Conduct.
        </Label>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || !codeOfConduct}
        className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Skickar..." : submitText}
      </button>
    </form>
  );
}
