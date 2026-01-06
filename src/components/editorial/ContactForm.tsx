import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(200, "Max 200 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(254, "Max 254 tecken"),
  company: z.string().trim().max(200, "Max 200 tecken").nullable(),
  message: z.string().trim().min(1, "Meddelande krävs").max(5000, "Max 5000 tecken"),
});

interface ContactFormProps {
  submitText?: string;
  successMessage?: string;
}

export function ContactForm({ 
  submitText = "Skicka meddelande", 
  successMessage = "Tack för ditt meddelande. Vi återkommer så snart vi kan."
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: (formData.get('company') as string) || null,
      message: formData.get('message') as string,
    };
    
    const result = contactSchema.safeParse(rawData);
    
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
      .from('contact_submissions')
      .insert({
        name: result.data.name,
        email: result.data.email,
        company: result.data.company,
        message: result.data.message,
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
      <div className="py-12 text-center">
        <p className="text-lg font-serif">{successMessage}</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      
      <div className="space-y-2">
        <Label htmlFor="company">Företag</Label>
        <Input 
          id="company" 
          name="company" 
          maxLength={200}
          className="bg-background border-border"
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Meddelande</Label>
        <Textarea 
          id="message" 
          name="message" 
          rows={5} 
          required 
          maxLength={5000}
          className="bg-background border-border resize-none"
          placeholder="Beskriv ert behov..."
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? "Skickar..." : submitText}
      </button>
    </form>
  );
}
