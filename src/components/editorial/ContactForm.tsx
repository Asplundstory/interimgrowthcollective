import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string || null,
      message: formData.get('message') as string,
    };
    
    const { error } = await supabase
      .from('contact_submissions')
      .insert(data);
    
    setIsSubmitting(false);
    
    if (error) {
      console.error('Error submitting contact form:', error);
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
      
      <div className="space-y-2">
        <Label htmlFor="company">Företag</Label>
        <Input 
          id="company" 
          name="company" 
          className="bg-background border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Meddelande</Label>
        <Textarea 
          id="message" 
          name="message" 
          rows={5} 
          required 
          className="bg-background border-border resize-none"
          placeholder="Beskriv ert behov..."
        />
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
