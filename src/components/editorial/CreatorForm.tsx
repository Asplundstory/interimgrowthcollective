import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

interface CreatorFormProps {
  submitText?: string;
  successMessage?: string;
}

export function CreatorForm({ 
  submitText, 
  successMessage
}: CreatorFormProps) {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeOfConduct, setCodeOfConduct] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const creatorSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(254),
    role: z.string().trim().min(1).max(200),
    portfolio_url: z.string().trim().url().max(500),
    q1_feeling: z.string().trim().min(1).max(2000),
    q2_structure: z.string().trim().min(1).max(2000),
    q3_pressure: z.string().trim().min(1).max(2000),
    code_of_conduct_accepted: z.literal(true),
  });
  
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
    
    const { error: dbError } = await supabase
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
        type: 'creator',
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        portfolioUrl: result.data.portfolio_url,
        q1Feeling: result.data.q1_feeling,
        q2Structure: result.data.q2_structure,
        q3Pressure: result.data.q3_pressure,
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
      <div className="py-12 text-center border border-border bg-card">
        <p className="text-lg font-serif px-6">{successMessage || t("creators.form.success")}</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <div className="space-y-6">
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
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role">{t("form.role")}</Label>
            <Input 
              id="role" 
              name="role" 
              required 
              maxLength={200}
              placeholder={t("form.rolePlaceholder")}
              className="bg-background border-border"
            />
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio">{t("form.portfolio")}</Label>
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
            {t("form.q1")}
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
            {t("form.q2")}
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
            {t("form.q3")}
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
          {t("form.codeOfConduct")}
        </Label>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || !codeOfConduct}
        className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t("form.sending") : (submitText || t("creators.form.submit"))}
      </button>
    </form>
  );
}
