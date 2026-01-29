import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, GripVertical, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeals, useCreateDeal, useUpdateDeal, useCompanies, useContacts, dealStatusLabels, DealStatus, Deal, Company, Contact } from "@/hooks/useCRM";
import { cn } from "@/lib/utils";

const pipelineStages: DealStatus[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

const stageColors: Record<DealStatus, string> = {
  lead: 'bg-slate-500',
  qualified: 'bg-blue-500',
  proposal: 'bg-yellow-500',
  negotiation: 'bg-orange-500',
  won: 'bg-green-500',
  lost: 'bg-red-500',
};

interface DealWithRelations extends Deal {
  company: Company | null;
  contact: Contact | null;
}

export function DealPipeline() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    company_id: "",
    contact_id: "",
    value: "",
    notes: "",
  });

  const { data: deals, isLoading } = useDeals();
  const { data: companies } = useCompanies();
  const { data: contacts } = useContacts();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = deals?.filter((deal) => deal.status === stage) || [];
    return acc;
  }, {} as Record<DealStatus, DealWithRelations[]>);

  const handleCreate = async () => {
    await createDeal.mutateAsync({
      title: newDeal.title,
      company_id: newDeal.company_id || null,
      contact_id: newDeal.contact_id || null,
      value: newDeal.value ? parseFloat(newDeal.value) : null,
      notes: newDeal.notes || null,
      status: 'lead',
    });
    setNewDeal({ title: "", company_id: "", contact_id: "", value: "", notes: "" });
    setIsCreateDialogOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("dealId", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: DealStatus) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    if (dealId) {
      await updateDeal.mutateAsync({ id: dealId, status: newStatus });
    }
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateStageValue = (stageDeals: DealWithRelations[]) => {
    const total = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return formatValue(total);
  };

  const filteredContacts = newDeal.company_id 
    ? contacts?.filter(c => c.company_id === newDeal.company_id)
    : contacts;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Affärspipeline
          </CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ny affär
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        ) : (
          <div className="grid grid-cols-6 gap-4 overflow-x-auto">
            {pipelineStages.map((stage) => (
              <div
                key={stage}
                className="min-w-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stageColors[stage])} />
                    <span className="font-medium text-sm">{dealStatusLabels[stage]}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dealsByStage[stage].length}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {calculateStageValue(dealsByStage[stage])}
                </div>
                <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                  {dealsByStage[stage].map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-background rounded-lg p-3 shadow-sm border cursor-grab hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/admin/crm/deals/${deal.id}`}
                            className="font-medium text-sm hover:underline block truncate"
                          >
                            {deal.title}
                          </Link>
                          {deal.company && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{deal.company.name}</span>
                            </div>
                          )}
                          {deal.contact && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span className="truncate">
                                {deal.contact.first_name} {deal.contact.last_name}
                              </span>
                            </div>
                          )}
                          {deal.value && (
                            <div className="text-sm font-semibold text-primary mt-2">
                              {formatValue(deal.value)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa ny affär</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                placeholder="Webbprojekt Q1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Företag</Label>
              <Select
                value={newDeal.company_id}
                onValueChange={(value) => setNewDeal({ ...newDeal, company_id: value, contact_id: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj företag..." />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Kontaktperson</Label>
              <Select
                value={newDeal.contact_id}
                onValueChange={(value) => setNewDeal({ ...newDeal, contact_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kontakt..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredContacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Värde (SEK)</Label>
              <Input
                id="value"
                type="number"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                placeholder="100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Anteckningar</Label>
              <Textarea
                id="notes"
                value={newDeal.notes}
                onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Avbryt
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newDeal.title || createDeal.isPending}
            >
              {createDeal.isPending ? "Skapar..." : "Skapa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
