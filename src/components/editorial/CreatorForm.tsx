import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const creatorSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(200, "Max 200 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(254, "Max 254 tecken"),
  role: z.string().trim().min(1, "Roll krävs").max(200, "Max 200 tecken"),
  portfolio_url: z.string().trim().url("Ogiltig URL").max(500, "Max 500 tecken"),
  q1_feeling: z.string().trim().min(1, "Svar krävs").max(2000, "Max 2000 tecken"),
  q2_structure: z.string().trim().min(1, "Svar krävs").max(2000, "Max 2000 tecken"),
  q3_pressure: z.string().trim().min(1, "Svar krävs").max(2000, "Max 2000 tecken"),
  code_of_conduct_accepted: z.literal(true, { errorMap: () => ({ message: "Du måste acceptera Code of Conduct" }) }),
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!codeOfConduct) return;
    
    setErrors({});
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      portfolio_url: formData.get('portfolio') as string,
      q1_feeling: formData.get('q1') as string,
      q2_structure: formData.get('q2') as string,
      q3_pressure: formData.get('q3') as string,
      code_of_conduct_accepted: codeOfConduct,
    };
    
    const result = creatorSchema.safeParse(rawData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }
    
    const { error } = await supabase
      .from('creator_applications')
      .insert({
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        portfolio_url: result.data.portfolio_url,
        q1_feeling: result.data.q1_feeling,
        q2_structure: result.data.q2_structure,
        q3_pressure: result.data.q3_pressure,
        code_of_conduct_accepted: result.data.code_of_conduct_accepted,
      });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({
        title: "Något gick fel",
        description: "Försök igen eller kontakta oss direkt via e-post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
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
              maxLength={200}
              className="bg-background border-border"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              maxLength={254}
              className="bg-background border-border"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">Roll / Disciplin</Label>
            <Input 
              id="role" 
              name="role" 
              required 
              maxLength={200}
              placeholder="t.ex. Brand Strategist, Art Director"
              className="bg-background border-border"
            />
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio">Länk till portfolio eller LinkedIn</Label>
            <Input 
              id="portfolio" 
              name="portfolio" 
              type="url" 
              required 
              maxLength={500}
              placeholder="https://"
              className="bg-background border-border"
            />
            {errors.portfolio_url && <p className="text-sm text-destructive">{errors.portfolio_url}</p>}
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
            maxLength={2000}
            className="bg-background border-border resize-none"
          />
          {errors.q1_feeling && <p className="text-sm text-destructive">{errors.q1_feeling}</p>}
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
            maxLength={2000}
            className="bg-background border-border resize-none"
          />
          {errors.q2_structure && <p className="text-sm text-destructive">{errors.q2_structure}</p>}
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
            maxLength={2000}
            className="bg-background border-border resize-none"
          />
          {errors.q3_pressure && <p className="text-sm text-destructive">{errors.q3_pressure}</p>}
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
