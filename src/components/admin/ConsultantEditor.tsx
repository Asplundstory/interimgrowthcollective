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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Save, Trash2, Upload, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProposalConsultant } from "@/hooks/useProposal";

interface ConsultantEditorProps {
  consultant: ProposalConsultant;
  onSave: (consultant: ProposalConsultant) => void;
  onDelete: () => void;
  isSaving: boolean;
}

export function ConsultantEditor({ consultant, onSave, onDelete, isSaving }: ConsultantEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(consultant.name);
  const [role, setRole] = useState(consultant.role);
  const [bio, setBio] = useState(consultant.bio || "");
  const [photoUrl, setPhotoUrl] = useState(consultant.photo_url || "");
  const [expertise, setExpertise] = useState(consultant.expertise?.join(", ") || "");
  const [availability, setAvailability] = useState(consultant.availability || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setName(consultant.name);
    setRole(consultant.role);
    setBio(consultant.bio || "");
    setPhotoUrl(consultant.photo_url || "");
    setExpertise(consultant.expertise?.join(", ") || "");
    setAvailability(consultant.availability || "");
  }, [consultant]);

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `consultants/${consultant.proposal_id}/${consultant.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cms-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("cms-images")
        .getPublicUrl(fileName);

      setPhotoUrl(urlData.publicUrl);
      toast.success("Foto uppladdat!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Kunde inte ladda upp foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl("");
  };

  const handleSave = () => {
    const expertiseArray = expertise
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSave({
      ...consultant,
      name,
      role,
      bio: bio || null,
      photo_url: photoUrl || null,
      expertise: expertiseArray,
      availability: availability || null,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <div className="flex items-center gap-3">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="text-left">
                  <span className="block">{name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{role}</span>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Photo upload */}
            <div className="space-y-2">
              <Label>Profilbild</Label>
              <div className="flex items-center gap-4">
                {photoUrl ? (
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt={name}
                      className="h-20 w-20 rounded-full object-cover border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 h-6 w-6"
                      onClick={handleRemovePhoto}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="h-20 w-20 rounded-full border border-dashed flex items-center justify-center hover:bg-muted/50 transition-colors">
                      {isUploading ? (
                        <span className="text-xs text-muted-foreground">Laddar...</span>
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${consultant.id}-name`}>Namn</Label>
                <Input
                  id={`${consultant.id}-name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${consultant.id}-role`}>Roll</Label>
                <Input
                  id={`${consultant.id}-role`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="t.ex. Brand Strategist"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${consultant.id}-bio`}>Biografi</Label>
              <Textarea
                id={`${consultant.id}-bio`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kort beskrivning av konsultens erfarenhet..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${consultant.id}-expertise`}>Expertis (kommaseparerad)</Label>
              <Input
                id={`${consultant.id}-expertise`}
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="Varumärkesstrategi, Positionering, Storytelling"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${consultant.id}-availability`}>Tillgänglighet</Label>
              <Input
                id={`${consultant.id}-availability`}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="t.ex. Tillgänglig från februari 2025"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Ta bort
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ta bort konsult?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Är du säker på att du vill ta bort {name} från detta förslag?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ta bort
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Sparar..." : "Spara konsult"}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
