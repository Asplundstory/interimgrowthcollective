import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

interface ContactFormProps {
  submitText?: string;
  successMessage?: string;
}

export function ContactForm({ 
  submitText, 
  successMessage
}: ContactFormProps) {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const contactSchema = z.object({
    name: z.string().trim().min(1, t("form.name") + " " + t("common.error")).max(200),
    email: z.string().trim().email(t("common.error")).max(254),
    company: z.string().trim().max(200).nullable(),
    message: z.string().trim().min(1, t("form.message") + " " + t("common.error")).max(5000),
  });
  
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
    
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: result.data.name,
        email: result.data.email,
        company: result.data.company,
        message: result.data.message,
      });
    
    if (dbError) {
      console.error("Database error:", dbError);
      toast({
        title: t("form.errorTitle"),
        description: t("form.errorDescription"),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Send email notification
    const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'contact',
        name: result.data.name,
        email: result.data.email,
        company: result.data.company,
        message: result.data.message,
      },
    });

    if (emailError) {
      console.error("Email error:", emailError);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-serif">{successMessage || t("contact.form.success")}</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("form.name")}</Label>
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
          <Label htmlFor="email">{t("form.email")}</Label>
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
        <Label htmlFor="company">{t("form.company")}</Label>
        <Input 
          id="company" 
          name="company" 
          maxLength={200}
          className="bg-background border-border"
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">{t("form.message")}</Label>
        <Textarea 
          id="message" 
          name="message" 
          rows={5} 
          required 
          maxLength={5000}
          className="bg-background border-border resize-none"
          placeholder={t("form.messagePlaceholder")}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? t("form.sending") : (submitText || t("contact.form.submit"))}
      </button>
    </form>
  );
}
