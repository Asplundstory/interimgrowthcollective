import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Save, Image as ImageIcon, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProposalSlide } from "@/hooks/useProposal";

interface SlideEditorProps {
  slide: ProposalSlide;
  slideTypeLabel: string;
  onSave: (content: Record<string, unknown>, title?: string) => void;
  isSaving: boolean;
}

// Define which fields are available for each slide type
const SLIDE_FIELDS: Record<string, { key: string; label: string; type: "text" | "textarea" | "image" | "array" }[]> = {
  title: [
    { key: "label", label: "Etikett", type: "text" },
    { key: "subtitle", label: "Underrubrik", type: "textarea" },
    { key: "scrollHint", label: "Navigeringstext", type: "text" },
    { key: "backgroundImage", label: "Bakgrundsbild", type: "image" },
  ],
  about: [
    { key: "label", label: "Etikett", type: "text" },
    { key: "headline", label: "Huvudrubrik", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "description", label: "Beskrivning", type: "textarea" },
    { key: "backgroundImage", label: "Bakgrundsbild", type: "image" },
  ],
  challenge: [
    { key: "headline", label: "Huvudrubrik", type: "text" },
    { key: "description", label: "Beskrivning", type: "textarea" },
    { key: "backgroundImage", label: "Bakgrundsbild", type: "image" },
  ],
  solution: [
    { key: "title", label: "Rubrik", type: "text" },
  ],
  consultants: [],
  delivery: [
    { key: "title", label: "Rubrik", type: "text" },
    { key: "approach", label: "Tillvägagångssätt", type: "textarea" },
    { key: "timeline", label: "Tidslinje", type: "text" },
    { key: "backgroundImage", label: "Bakgrundsbild", type: "image" },
  ],
  investment: [
    { key: "price", label: "Pris", type: "text" },
    { key: "period", label: "Period", type: "text" },
    { key: "terms", label: "Villkor", type: "textarea" },
    { key: "note", label: "Fotnot", type: "textarea" },
  ],
  cta: [
    { key: "email", label: "E-post", type: "text" },
    { key: "phone", label: "Telefon", type: "text" },
    { key: "bookingUrl", label: "Bokningslänk", type: "text" },
  ],
};

export function SlideEditor({ slide, slideTypeLabel, onSave, isSaving }: SlideEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>(slide.content || {});
  const [title, setTitle] = useState(slide.title || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setContent(slide.content || {});
    setTitle(slide.title || "");
  }, [slide]);

  const fields = SLIDE_FIELDS[slide.slide_type] || [];

  const handleFieldChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (key: string, file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `proposals/${slide.proposal_id}/${slide.id}-${key}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cms-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("cms-images")
        .getPublicUrl(fileName);

      handleFieldChange(key, urlData.publicUrl);
      toast.success("Bild uppladdad!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Kunde inte ladda upp bild");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (key: string) => {
    setContent((prev) => {
      const newContent = { ...prev };
      delete newContent[key];
      return newContent;
    });
  };

  const handleSave = () => {
    onSave(content, title || undefined);
  };

  // For slides without configurable fields
  if (fields.length === 0 && slide.slide_type === "consultants") {
    return (
      <Card className="opacity-70">
        <CardHeader className="py-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {slideTypeLabel}
            <span className="text-xs font-normal text-muted-foreground">
              (Hanteras via fliken "Konsulter")
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>{slideTypeLabel}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Custom title field for slides that support it */}
            {["challenge", "solution"].includes(slide.slide_type) && (
              <div className="space-y-2">
                <Label htmlFor={`${slide.id}-title`}>Slide-rubrik</Label>
                <Input
                  id={`${slide.id}-title`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Anpassad rubrik..."
                />
              </div>
            )}

            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`${slide.id}-${field.key}`}>{field.label}</Label>
                
                {field.type === "text" && (
                  <Input
                    id={`${slide.id}-${field.key}`}
                    value={(content[field.key] as string) || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={`Ange ${field.label.toLowerCase()}...`}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={`${slide.id}-${field.key}`}
                    value={(content[field.key] as string) || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={`Ange ${field.label.toLowerCase()}...`}
                    rows={3}
                  />
                )}

                {field.type === "image" && (
                  <div className="space-y-2">
                    {content[field.key] ? (
                      <div className="relative inline-block">
                        <img
                          src={content[field.key] as string}
                          alt={field.label}
                          className="h-32 w-auto rounded-md object-cover border"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => handleRemoveImage(field.key)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-muted/50 transition-colors">
                          {isUploading ? (
                            <span className="text-sm text-muted-foreground">Laddar upp...</span>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Välj bild...
                              </span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(field.key, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Sparar..." : "Spara slide"}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
