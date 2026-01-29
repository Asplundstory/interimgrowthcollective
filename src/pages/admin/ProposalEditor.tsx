import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useProposal } from "@/hooks/useProposal";
import { ProposalPreview } from "@/components/admin/ProposalPreview";
import {
  useUpdateProposal,
  useUpdateSlide,
  useCreateConsultant,
  useUpdateConsultant,
  useDeleteConsultant,
} from "@/hooks/useProposals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Save,
  User,
  Plus,
  Trash2,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { SlideEditor } from "@/components/admin/SlideEditor";
import { ConsultantEditor } from "@/components/admin/ConsultantEditor";
import type { ProposalSlide, ProposalConsultant } from "@/hooks/useProposal";

const STATUS_OPTIONS = [
  { value: "draft", label: "Utkast" },
  { value: "sent", label: "Skickad" },
  { value: "viewed", label: "Visad" },
  { value: "accepted", label: "Accepterad" },
  { value: "declined", label: "Avböjd" },
];

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: "Titel",
  about: "Om oss",
  challenge: "Utmaning",
  solution: "Lösning",
  consultants: "Konsulter",
  delivery: "Leverans",
  investment: "Investering",
  cta: "Nästa steg",
};

export default function ProposalEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdmin();

  // We need to get proposal by ID, not slug - so we'll query directly
  const [proposal, setProposal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateProposal = useUpdateProposal();
  const updateSlide = useUpdateSlide();
  const createConsultant = useCreateConsultant();
  const updateConsultant = useUpdateConsultant();
  const deleteConsultant = useDeleteConsultant();

  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (id && isAdmin) {
      fetchProposal();
    }
  }, [id, isAdmin]);

  const fetchProposal = async () => {
    if (!id) return;

    setIsLoading(true);
    const { supabase } = await import("@/integrations/supabase/client");

    const { data: proposalData, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !proposalData) {
      toast.error("Kunde inte ladda förslag");
      navigate("/admin/proposals");
      return;
    }

    const [slidesResult, consultantsResult] = await Promise.all([
      supabase
        .from("proposal_slides")
        .select("*")
        .eq("proposal_id", id)
        .order("sort_order"),
      supabase
        .from("proposal_consultants")
        .select("*")
        .eq("proposal_id", id)
        .order("sort_order"),
    ]);

    setProposal({
      ...proposalData,
      slides: (slidesResult.data || []).map((s) => ({
        ...s,
        content: s.content as Record<string, unknown>,
      })),
      consultants: (consultantsResult.data || []).map((c) => ({
        ...c,
        expertise: c.expertise || [],
      })),
    });
    setClientName(proposalData.client_name);
    setProjectTitle(proposalData.project_title);
    setStatus(proposalData.status);
    setIsLoading(false);
  };

  const handleSaveBasicInfo = async () => {
    if (!id) return;

    try {
      await updateProposal.mutateAsync({
        id,
        client_name: clientName,
        project_title: projectTitle,
        status: status as any,
      });
      toast.success("Sparat!");
      fetchProposal();
    } catch (error) {
      toast.error("Kunde inte spara");
    }
  };

  const handleSaveSlide = async (slideId: string, content: Record<string, unknown>, title?: string) => {
    try {
      await updateSlide.mutateAsync({
        id: slideId,
        title,
        content,
      });
      toast.success("Slide sparad!");
      fetchProposal();
    } catch (error) {
      toast.error("Kunde inte spara slide");
    }
  };

  const handleAddConsultant = async () => {
    if (!id) return;

    try {
      await createConsultant.mutateAsync({
        proposal_id: id,
        name: "Ny konsult",
        role: "Roll",
      });
      toast.success("Konsult tillagd!");
      fetchProposal();
    } catch (error) {
      toast.error("Kunde inte lägga till konsult");
    }
  };

  const handleSaveConsultant = async (consultant: ProposalConsultant) => {
    try {
      await updateConsultant.mutateAsync({
        id: consultant.id,
        name: consultant.name,
        role: consultant.role,
        bio: consultant.bio,
        photo_url: consultant.photo_url,
        expertise: consultant.expertise,
        availability: consultant.availability,
      });
      toast.success("Konsult sparad!");
      fetchProposal();
    } catch (error) {
      toast.error("Kunde inte spara konsult");
    }
  };

  const handleDeleteConsultant = async (consultantId: string) => {
    try {
      await deleteConsultant.mutateAsync(consultantId);
      toast.success("Konsult borttagen!");
      fetchProposal();
    } catch (error) {
      toast.error("Kunde inte ta bort konsult");
    }
  };

  const handleCopyLink = async () => {
    if (!proposal) return;
    const url = `${window.location.origin}/p/${proposal.slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Länk kopierad!");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (!isAdmin || !proposal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/proposals")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{proposal.client_name}</h1>
              <p className="text-muted-foreground">{proposal.project_title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Kopiera länk
            </Button>
            <Button onClick={() => setPreviewOpen(true)}>
              <Play className="h-4 w-4 mr-2" />
              Förhandsgranska
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/p/${proposal.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Öppna i ny flik
              </Link>
            </Button>
          </div>
        </div>

        {/* Preview Modal */}
        <ProposalPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          proposal={proposal}
        />

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Grundinfo</TabsTrigger>
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="consultants">Konsulter</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grundläggande information</CardTitle>
                <CardDescription>
                  Kundnamn, projekttitel och status för förslaget.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Kundnamn</Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Projekttitel</Label>
                    <Input
                      id="project-title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visningar</Label>
                    <div className="h-10 flex items-center text-muted-foreground">
                      {proposal.view_count} visningar
                      {proposal.last_viewed_at && (
                        <span className="ml-2 text-sm">
                          (senast {new Date(proposal.last_viewed_at).toLocaleDateString("sv-SE")})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveBasicInfo} disabled={updateProposal.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateProposal.isPending ? "Sparar..." : "Spara ändringar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delbar länk</CardTitle>
                <CardDescription>
                  Den hemliga URL:en som kunderna får tillgång till presentationen genom.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/p/${proposal.slug}`}
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slides Tab */}
          <TabsContent value="slides" className="space-y-4">
            {proposal.slides.map((slide: ProposalSlide) => (
              <SlideEditor
                key={slide.id}
                slide={slide}
                slideTypeLabel={SLIDE_TYPE_LABELS[slide.slide_type] || slide.slide_type}
                onSave={(content, title) => handleSaveSlide(slide.id, content, title)}
                isSaving={updateSlide.isPending}
              />
            ))}
          </TabsContent>

          {/* Consultants Tab */}
          <TabsContent value="consultants" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Lägg till och redigera konsulter som ingår i detta förslag.
              </p>
              <Button onClick={handleAddConsultant} disabled={createConsultant.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Lägg till konsult
              </Button>
            </div>

            {proposal.consultants.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Inga konsulter tillagda ännu. Klicka på "Lägg till konsult" för att komma igång.
                  </p>
                </CardContent>
              </Card>
            ) : (
              proposal.consultants.map((consultant: ProposalConsultant) => (
                <ConsultantEditor
                  key={consultant.id}
                  consultant={consultant}
                  onSave={handleSaveConsultant}
                  onDelete={() => handleDeleteConsultant(consultant.id)}
                  isSaving={updateConsultant.isPending}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
