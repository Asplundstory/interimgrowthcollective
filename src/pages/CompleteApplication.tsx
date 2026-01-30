import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, User, Mail, Briefcase, Phone, Linkedin, FileText, Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  phone: z.string().min(8, "Ange ett giltigt telefonnummer"),
  linkedin_url: z.string().url("Ange en giltig LinkedIn-URL").optional().or(z.literal("")),
  availability: z.string().min(1, "Ange din tillgänglighet"),
  hourly_rate: z.string().optional(),
  reference1_name: z.string().min(2, "Ange referensens namn"),
  reference1_company: z.string().optional(),
  reference1_title: z.string().optional(),
  reference1_email: z.string().email("Ange en giltig e-postadress").optional().or(z.literal("")),
  reference1_phone: z.string().optional(),
  code_of_conduct_accepted: z.boolean().refine((val) => val === true, {
    message: "Du måste godkänna uppförandekoden",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationData {
  id: string;
  name: string;
  email: string;
  role: string;
  portfolio_url: string;
  q1_feeling: string;
  q2_structure: string;
  q3_pressure: string;
}

export default function CompleteApplication() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      linkedin_url: "",
      availability: "",
      hourly_rate: "",
      reference1_name: "",
      reference1_company: "",
      reference1_title: "",
      reference1_email: "",
      reference1_phone: "",
      code_of_conduct_accepted: false,
    },
  });

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("creator_applications")
        .select("*")
        .eq("invitation_token", token)
        .single();

      if (error || !data) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Check if already completed
      if (data.status === "completed" || data.candidate_id) {
        setIsCompleted(true);
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Check expiration
      if (data.invitation_expires_at && new Date(data.invitation_expires_at) < new Date()) {
        setIsExpired(true);
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      setApplicationData(data as unknown as ApplicationData);
      setIsValid(true);
    } catch (err) {
      console.error("Token validation error:", err);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Max filstorlek är 10 MB",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!applicationData || !token) return;

    setIsSubmitting(true);

    try {
      let cvUrl: string | null = null;

      // Upload CV if provided
      if (cvFile) {
        const fileExt = cvFile.name.split(".").pop();
        const fileName = `${applicationData.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("candidate-cvs")
          .upload(fileName, cvFile);

        if (uploadError) {
          throw new Error("Kunde inte ladda upp CV");
        }

        const { data: urlData } = supabase.storage
          .from("candidate-cvs")
          .getPublicUrl(fileName);
        
        cvUrl = urlData.publicUrl;
      }

      // Parse name into first and last
      const nameParts = applicationData.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      // Create candidate record
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: applicationData.email,
          role: applicationData.role,
          phone: data.phone,
          linkedin_url: data.linkedin_url || null,
          portfolio_url: applicationData.portfolio_url,
          cv_url: cvUrl,
          availability: data.availability,
          hourly_rate: data.hourly_rate ? parseInt(data.hourly_rate) : null,
          q1_feeling: applicationData.q1_feeling,
          q2_structure: applicationData.q2_structure,
          q3_pressure: applicationData.q3_pressure,
          code_of_conduct_accepted: data.code_of_conduct_accepted,
          status: "new",
        })
        .select()
        .single();

      if (candidateError || !candidate) {
        throw new Error("Kunde inte skapa kandidatprofil");
      }

      // Add reference
      if (data.reference1_name) {
        await supabase.from("candidate_references").insert({
          candidate_id: candidate.id,
          name: data.reference1_name,
          company: data.reference1_company || null,
          title: data.reference1_title || null,
          email: data.reference1_email || null,
          phone: data.reference1_phone || null,
        });
      }

      // Update application status - using service role via edge function would be ideal
      // but for now we'll mark it completed via the token-based update
      const { error: updateError } = await supabase
        .from("creator_applications")
        .update({
          status: "completed",
          candidate_id: candidate.id,
        })
        .eq("invitation_token", token);

      if (updateError) {
        console.error("Could not update application status:", updateError);
        // Not critical, candidate was created successfully
      }

      setIsCompleted(true);
      toast({
        title: "Registrering slutförd!",
        description: "Tack för din registrering. Vi återkommer snart.",
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        title: "Något gick fel",
        description: err instanceof Error ? err.message : "Försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Validerar din inbjudan...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Registrering slutförd!</h1>
            <p className="text-muted-foreground mb-6">
              Tack för att du slutförde din registrering. Vi kommer att granska din 
              profil och återkommer inom kort.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Tillbaka till startsidan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {isExpired ? "Inbjudan har gått ut" : "Ogiltig länk"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isExpired
                ? "Din inbjudan har tyvärr gått ut. Kontakta oss för att få en ny."
                : "Länken är ogiltig eller har redan använts. Kontakta oss om du behöver hjälp."}
            </p>
            <Button onClick={() => navigate("/contact")} variant="outline">
              Kontakta oss
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Slutför din registrering</CardTitle>
            <CardDescription>
              Fyll i kompletterande uppgifter för att slutföra din registrering i
              kandidatdatabasen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pre-filled info */}
            <div className="bg-muted p-4 rounded-lg mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{applicationData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{applicationData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{applicationData.role}</span>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact info */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Kontaktuppgifter
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+46 70 123 45 67"
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn-profil</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin_url"
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="pl-10"
                        {...form.register("linkedin_url")}
                      />
                    </div>
                    {form.formState.errors.linkedin_url && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.linkedin_url.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional info */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professionell information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="availability">Tillgänglighet *</Label>
                    <Input
                      id="availability"
                      placeholder="T.ex. Omgående, från mars 2026"
                      {...form.register("availability")}
                    />
                    {form.formState.errors.availability && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.availability.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Önskat timpris (SEK)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      placeholder="1200"
                      {...form.register("hourly_rate")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">CV (PDF, max 10 MB)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      className="hidden"
                    />
                    <label htmlFor="cv" className="cursor-pointer">
                      {cvFile ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-5 w-5" />
                          <span>{cvFile.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Klicka för att ladda upp CV
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reference */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Referens
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reference1_name">Namn *</Label>
                    <Input
                      id="reference1_name"
                      placeholder="Anna Andersson"
                      {...form.register("reference1_name")}
                    />
                    {form.formState.errors.reference1_name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.reference1_name.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference1_company">Företag</Label>
                    <Input
                      id="reference1_company"
                      placeholder="Företag AB"
                      {...form.register("reference1_company")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference1_title">Titel</Label>
                    <Input
                      id="reference1_title"
                      placeholder="Marketing Director"
                      {...form.register("reference1_title")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference1_email">E-post</Label>
                    <Input
                      id="reference1_email"
                      type="email"
                      placeholder="anna@foretag.se"
                      {...form.register("reference1_email")}
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="reference1_phone">Telefon</Label>
                    <Input
                      id="reference1_phone"
                      type="tel"
                      placeholder="+46 70 123 45 67"
                      {...form.register("reference1_phone")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Code of Conduct */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="code_of_conduct"
                  checked={form.watch("code_of_conduct_accepted")}
                  onCheckedChange={(checked) =>
                    form.setValue("code_of_conduct_accepted", checked === true)
                  }
                />
                <div className="space-y-1">
                  <label
                    htmlFor="code_of_conduct"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Jag godkänner uppförandekoden *
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Genom att kryssa i rutan godkänner jag att följa nätverkets
                    uppförandekod och etiska riktlinjer.
                  </p>
                  {form.formState.errors.code_of_conduct_accepted && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.code_of_conduct_accepted.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Slutför registrering
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
