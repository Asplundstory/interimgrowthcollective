import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  Users, Search, MoreHorizontal, Trash2, Eye, Mail, Phone, 
  FileText, ExternalLink, ChevronDown, ChevronUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  useCandidates, 
  useUpdateCandidate, 
  useDeleteCandidate, 
  useCandidateReferences,
  candidateStatusLabels, 
  candidateStatusColors,
  CandidateStatus,
  Candidate 
} from "@/hooks/useCandidates";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

function CandidateDetails({ candidate }: { candidate: Candidate }) {
  const { data: references } = useCandidateReferences(candidate.id);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  const getCvUrl = async () => {
    if (candidate.cv_url && !cvUrl) {
      const { data } = await supabase.storage
        .from("candidate-cvs")
        .createSignedUrl(candidate.cv_url, 3600);
      if (data?.signedUrl) {
        setCvUrl(data.signedUrl);
      }
    }
  };

  return (
    <div className="p-4 space-y-6 bg-muted/30">
      {/* Contact info */}
      <div className="flex flex-wrap gap-4">
        {candidate.phone && (
          <a href={`tel:${candidate.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
            <Phone className="h-4 w-4" />
            {candidate.phone}
          </a>
        )}
        {candidate.linkedin_url && (
          <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
            <ExternalLink className="h-4 w-4" />
            LinkedIn
          </a>
        )}
        {candidate.portfolio_url && (
          <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
            <ExternalLink className="h-4 w-4" />
            Portfolio
          </a>
        )}
        {candidate.cv_url && (
          <Button variant="outline" size="sm" onClick={getCvUrl} asChild={!!cvUrl}>
            {cvUrl ? (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ladda ner CV
              </a>
            ) : (
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Visa CV
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Questions */}
      <div className="grid gap-4 md:grid-cols-3">
        {candidate.q1_feeling && (
          <div className="bg-background p-3 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Projekt där känslan styrde</p>
            <p className="text-sm">{candidate.q1_feeling}</p>
          </div>
        )}
        {candidate.q2_structure && (
          <div className="bg-background p-3 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Struktur vs kreativitet</p>
            <p className="text-sm">{candidate.q2_structure}</p>
          </div>
        )}
        {candidate.q3_pressure && (
          <div className="bg-background p-3 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Leverera under press</p>
            <p className="text-sm">{candidate.q3_pressure}</p>
          </div>
        )}
      </div>

      {/* References */}
      {references && references.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Referenser</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {references.map((ref) => (
              <div key={ref.id} className="bg-background p-3 rounded-lg border text-sm">
                <p className="font-medium">{ref.name}</p>
                {ref.title && ref.company && (
                  <p className="text-muted-foreground">{ref.title} @ {ref.company}</p>
                )}
                <div className="flex gap-4 mt-1 text-xs">
                  {ref.email && (
                    <a href={`mailto:${ref.email}`} className="text-primary hover:underline">{ref.email}</a>
                  )}
                  {ref.phone && <span>{ref.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm">
        <Badge variant={candidate.code_of_conduct_accepted ? "default" : "destructive"}>
          {candidate.code_of_conduct_accepted ? "Godkänt uppförandekod" : "Ej godkänt"}
        </Badge>
      </div>
    </div>
  );
}

export function CandidateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: candidates, isLoading } = useCandidates(statusFilter === "all" ? undefined : statusFilter);
  const updateCandidate = useUpdateCandidate();
  const deleteCandidate = useDeleteCandidate();

  const filteredCandidates = candidates?.filter((candidate) => {
    const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.role.toLowerCase().includes(query)
    );
  });

  const handleStatusChange = async (id: string, status: CandidateStatus) => {
    await updateCandidate.mutateAsync({ id, status });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kandidater
          </CardTitle>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CandidateStatus | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alla statusar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla statusar</SelectItem>
              {(Object.keys(candidateStatusLabels) as CandidateStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {candidateStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök kandidater..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        ) : filteredCandidates?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "Inga kandidater hittades" : "Inga kandidater ännu"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCandidates?.map((candidate) => (
              <Collapsible
                key={candidate.id}
                open={expandedId === candidate.id}
                onOpenChange={(open) => setExpandedId(open ? candidate.id : null)}
              >
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full", candidateStatusColors[candidate.status])} />
                        <div>
                          <p className="font-medium">
                            {candidate.first_name} {candidate.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <a 
                          href={`mailto:${candidate.email}`} 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(candidate.created_at), "d MMM yyyy", { locale: sv })}
                        </span>
                        <Select
                          value={candidate.status}
                          onValueChange={(v) => handleStatusChange(candidate.id, v as CandidateStatus)}
                        >
                          <SelectTrigger className="w-[130px]" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(candidateStatusLabels) as CandidateStatus[]).map((status) => (
                              <SelectItem key={status} value={status}>
                                {candidateStatusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => deleteCandidate.mutate(candidate.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Ta bort
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {expandedId === candidate.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CandidateDetails candidate={candidate} />
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
