import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useProposals, useCreateProposal, useDeleteProposal } from "@/hooks/useProposals";
import { generateProposalSlug } from "@/hooks/useProposal";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  ArrowLeft,
  Plus,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Utkast", variant: "secondary" },
  sent: { label: "Skickad", variant: "outline" },
  viewed: { label: "Visad", variant: "default" },
  accepted: { label: "Accepterad", variant: "default" },
  declined: { label: "Avböjd", variant: "destructive" },
};

export default function AdminProposals() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdmin();
  const { data: proposals, isLoading } = useProposals();
  const createProposal = useCreateProposal();
  const deleteProposal = useDeleteProposal();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleCreate = async () => {
    if (!newClientName.trim() || !newProjectTitle.trim()) {
      toast.error("Fyll i alla fält");
      return;
    }

    try {
      const slug = generateProposalSlug(newClientName);
      const proposal = await createProposal.mutateAsync({
        client_name: newClientName.trim(),
        project_title: newProjectTitle.trim(),
        slug,
      });
      
      setCreateDialogOpen(false);
      setNewClientName("");
      setNewProjectTitle("");
      
      toast.success("Förslag skapat!");
      navigate(`/admin/proposals/${proposal.id}`);
    } catch (error) {
      toast.error("Kunde inte skapa förslag");
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Länk kopierad!");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal.mutateAsync(id);
      toast.success("Förslag raderat");
    } catch (error) {
      toast.error("Kunde inte radera förslag");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Kundförslag</h1>
              <p className="text-muted-foreground">Hantera affärsförslag till kunder</p>
            </div>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nytt förslag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Skapa nytt förslag</DialogTitle>
                <DialogDescription>
                  Ange kundens namn och en projekttitel för att komma igång.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Kundnamn</Label>
                  <Input
                    id="client-name"
                    placeholder="t.ex. Acme AB"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-title">Projekttitel</Label>
                  <Input
                    id="project-title"
                    placeholder="t.ex. Interim Brand Manager"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleCreate} disabled={createProposal.isPending}>
                  {createProposal.isPending ? "Skapar..." : "Skapa förslag"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!proposals || proposals.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga förslag ännu</h3>
            <p className="text-muted-foreground mb-4">
              Skapa ditt första kundförslag för att komma igång.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nytt förslag
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kund</TableHead>
                  <TableHead>Projekt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visningar</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => {
                  const status = STATUS_LABELS[proposal.status] || STATUS_LABELS.draft;
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.client_name}</TableCell>
                      <TableCell>{proposal.project_title}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {proposal.view_count}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(proposal.created_at), "d MMM yyyy", { locale: sv })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyLink(proposal.slug)}
                            title="Kopiera länk"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Förhandsgranska"
                          >
                            <Link to={`/p/${proposal.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Redigera"
                          >
                            <Link to={`/admin/proposals/${proposal.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Radera">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Radera förslag?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Detta tar bort förslaget till {proposal.client_name} permanent.
                                  Åtgärden kan inte ångras.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(proposal.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Radera
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
