import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitCandidateApplication, CandidateApplication } from "@/hooks/useCandidates";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  linkedin_url: string;
  portfolio_url: string;
  cv_file: File | null;
  q1_feeling: string;
  q2_structure: string;
  q3_pressure: string;
  code_of_conduct_accepted: boolean;
  references: Array<{
    name: string;
    company: string;
    title: string;
    email: string;
    phone: string;
  }>;
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "",
  linkedin_url: "",
  portfolio_url: "",
  cv_file: null,
  q1_feeling: "",
  q2_structure: "",
  q3_pressure: "",
  code_of_conduct_accepted: false,
  references: [{ name: "", company: "", title: "", email: "", phone: "" }],
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function CandidateApplicationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const submitApplication = useSubmitCandidateApplication();

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("cv_file", file);
    }
  };

  const removeFile = () => {
    updateField("cv_file", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { name: "", company: "", title: "", email: "", phone: "" }],
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  const removeReference = (index: number) => {
    if (formData.references.length > 1) {
      setFormData((prev) => ({
        ...prev,
        references: prev.references.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    const application: CandidateApplication = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || undefined,
      role: formData.role,
      linkedin_url: formData.linkedin_url || undefined,
      portfolio_url: formData.portfolio_url || undefined,
      cv_file: formData.cv_file || undefined,
      q1_feeling: formData.q1_feeling,
      q2_structure: formData.q2_structure,
      q3_pressure: formData.q3_pressure,
      code_of_conduct_accepted: formData.code_of_conduct_accepted,
      references: formData.references.filter((ref) => ref.name.trim() !== ""),
    };

    try {
      await submitApplication.mutateAsync(application);
      setIsSubmitted(true);
    } catch (error) {
      // Error handled in hook
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.email;
      case 2:
        return formData.role;
      case 3:
        return true; // CV is optional
      case 4:
        return formData.q1_feeling && formData.q2_structure && formData.q3_pressure;
      case 5:
        return true; // References are optional
      case 6:
        return formData.code_of_conduct_accepted;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Tack för din ansökan!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Vi har tagit emot din ansökan och återkommer inom kort. 
          Håll utkik i din inkorg för nästa steg.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Steg {step} av {TOTAL_STEPS}</span>
          <span className="text-sm text-muted-foreground">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={false}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form steps */}
      <div className="relative min-h-[400px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Låt oss lära känna dig</h2>
                  <p className="text-muted-foreground">Börja med dina kontaktuppgifter.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Förnamn *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      placeholder="Anna"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Efternamn *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      placeholder="Andersson"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-postadress *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="anna@exempel.se"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="070-123 45 67"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Din professionella profil</h2>
                  <p className="text-muted-foreground">Berätta om din roll och var vi kan se mer av ditt arbete.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Roll / Kompetensområde *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="t.ex. UX Designer, Frontend-utvecklare, Content Strategist"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn-profil</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => updateField("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/ditt-namn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">Portfolio / Webbplats</Label>
                  <Input
                    id="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={(e) => updateField("portfolio_url", e.target.value)}
                    placeholder="https://din-portfolio.se"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ladda upp ditt CV</h2>
                  <p className="text-muted-foreground">Dela ditt CV så vi kan lära känna din bakgrund bättre.</p>
                </div>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    formData.cv_file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {formData.cv_file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="font-medium">{formData.cv_file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium mb-1">Klicka för att ladda upp</p>
                      <p className="text-sm text-muted-foreground">PDF eller Word-dokument (max 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Berätta mer om dig</h2>
                  <p className="text-muted-foreground">Vi vill förstå hur du arbetar och tänker.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q1">Beskriv ett projekt där känslan styrde leveranskvaliteten. *</Label>
                  <Textarea
                    id="q1"
                    value={formData.q1_feeling}
                    onChange={(e) => updateField("q1_feeling", e.target.value)}
                    placeholder="Berätta om ett projekt där ditt engagemang och känsla för uppdraget gjorde skillnad..."
                    rows={3}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q2">Hur skapar du struktur utan att döda kreativiteten? *</Label>
                  <Textarea
                    id="q2"
                    value={formData.q2_structure}
                    onChange={(e) => updateField("q2_structure", e.target.value)}
                    placeholder="Beskriv hur du balanserar ordning och frihet i ditt arbete..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q3">Vad behöver du för att leverera stabilt under press? *</Label>
                  <Textarea
                    id="q3"
                    value={formData.q3_pressure}
                    onChange={(e) => updateField("q3_pressure", e.target.value)}
                    placeholder="Berätta om vad som hjälper dig prestera när det blir intensivt..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Referenser</h2>
                  <p className="text-muted-foreground">Lägg till personer som kan rekommendera dig (valfritt).</p>
                </div>
                {formData.references.map((ref, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                    {formData.references.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeReference(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Namn</Label>
                        <Input
                          value={ref.name}
                          onChange={(e) => updateReference(index, "name", e.target.value)}
                          placeholder="Anna Svensson"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Företag</Label>
                        <Input
                          value={ref.company}
                          onChange={(e) => updateReference(index, "company", e.target.value)}
                          placeholder="Företag AB"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>E-post</Label>
                        <Input
                          type="email"
                          value={ref.email}
                          onChange={(e) => updateReference(index, "email", e.target.value)}
                          placeholder="anna@foretag.se"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input
                          value={ref.phone}
                          onChange={(e) => updateReference(index, "phone", e.target.value)}
                          placeholder="070-123 45 67"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addReference} className="w-full">
                  Lägg till ytterligare referens
                </Button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Uppförandekod</h2>
                  <p className="text-muted-foreground">Läs igenom och godkänn vår uppförandekod.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-6 max-h-64 overflow-y-auto text-sm space-y-4">
                  <h3 className="font-semibold">IGC Code of Conduct</h3>
                  <p>Som konsult hos Interim Growth Collective förbinder jag mig att:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Alltid agera professionellt och etiskt i alla uppdrag</li>
                    <li>Respektera konfidentialitet och hantera känslig information med omsorg</li>
                    <li>Leverera högkvalitativt arbete inom överenskomna tidsramar</li>
                    <li>Kommunicera öppet och ärligt med både IGC och kunder</li>
                    <li>Bidra till en positiv och inkluderande arbetsmiljö</li>
                    <li>Kontinuerligt utveckla mina kunskaper och kompetenser</li>
                    <li>Representera IGC på ett sätt som stärker vårt gemensamma varumärke</li>
                  </ul>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="coc"
                    checked={formData.code_of_conduct_accepted}
                    onCheckedChange={(checked) => updateField("code_of_conduct_accepted", checked === true)}
                  />
                  <Label htmlFor="coc" className="text-sm leading-relaxed cursor-pointer">
                    Jag har läst och godkänner IGC:s uppförandekod och förbinder mig att följa dess riktlinjer. *
                  </Label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            Fortsätt
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || submitApplication.isPending}
            className="gap-2"
          >
            {submitApplication.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              <>
                Skicka ansökan
                <Check className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
