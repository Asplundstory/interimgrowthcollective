import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Download, Check, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useDocumentTemplates,
  useDocumentTemplate,
  useCreateGeneratedDocument,
  fillTemplate,
  templateTypeLabels,
} from "@/hooks/useDocuments";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function DocumentGenerator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTemplateId = searchParams.get("template");
  const preselectedCompanyId = searchParams.get("company");
  const preselectedDealId = searchParams.get("deal");
  const preselectedCandidateId = searchParams.get("candidate");

  const [selectedTemplateId, setSelectedTemplateId] = useState(preselectedTemplateId || "");
  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId || "");
  const [selectedDealId, setSelectedDealId] = useState(preselectedDealId || "");
  const [selectedCandidateId, setSelectedCandidateId] = useState(preselectedCandidateId || "");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [documentTitle, setDocumentTitle] = useState("");

  const { data: templates } = useDocumentTemplates();
  const { data: template } = useDocumentTemplate(selectedTemplateId || undefined);
  const createDocument = useCreateGeneratedDocument();

  // Fetch companies
  const { data: companies } = useQuery({
    queryKey: ["companies-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch deals for selected company
  const { data: deals } = useQuery({
    queryKey: ["deals-select", selectedCompanyId],
    queryFn: async () => {
      let query = supabase.from("deals").select("id, title").order("created_at", { ascending: false });
      if (selectedCompanyId) {
        query = query.eq("company_id", selectedCompanyId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  // Fetch candidates
  const { data: candidates } = useQuery({
    queryKey: ["candidates-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, first_name, last_name, role")
        .eq("status", "approved")
        .order("first_name");
      if (error) throw error;
      return data;
    },
  });

  // Auto-fill document title when template is selected
  useEffect(() => {
    if (template && !documentTitle) {
      const company = companies?.find(c => c.id === selectedCompanyId);
      const candidate = candidates?.find(c => c.id === selectedCandidateId);
      
      let title = template.name;
      if (company) title += ` - ${company.name}`;
      if (candidate) title += ` - ${candidate.first_name} ${candidate.last_name}`;
      
      setDocumentTitle(title);
    }
  }, [template, selectedCompanyId, selectedCandidateId, companies, candidates]);

  // Auto-fill some field values from selected entities
  useEffect(() => {
    if (!template) return;

    const newValues = { ...fieldValues };
    
    if (selectedCompanyId) {
      const company = companies?.find(c => c.id === selectedCompanyId);
      if (company) {
        if (template.fields.some(f => f.name === 'kundforetag')) {
          newValues.kundforetag = company.name;
        }
        if (template.fields.some(f => f.name === 'kundnamn')) {
          newValues.kundnamn = company.name;
        }
      }
    }

    if (selectedCandidateId) {
      const candidate = candidates?.find(c => c.id === selectedCandidateId);
      if (candidate) {
        if (template.fields.some(f => f.name === 'konsultnamn')) {
          newValues.konsultnamn = `${candidate.first_name} ${candidate.last_name}`;
        }
        if (template.fields.some(f => f.name === 'roll')) {
          newValues.roll = candidate.role;
        }
      }
    }

    if (template.fields.some(f => f.name === 'datum')) {
      newValues.datum = new Date().toISOString().split('T')[0];
    }

    setFieldValues(newValues);
  }, [template, selectedCompanyId, selectedCandidateId, companies, candidates]);

  const previewContent = template ? fillTemplate(template.content, fieldValues) : "";

  const handleGenerate = async () => {
    if (!template) {
      toast.error("Välj en mall");
      return;
    }
    if (!documentTitle) {
      toast.error("Ange en dokumenttitel");
      return;
    }

    // Check required fields
    const missingRequired = template.fields
      .filter(f => f.required && !fieldValues[f.name])
      .map(f => f.label);

    if (missingRequired.length > 0) {
      toast.error(`Fyll i obligatoriska fält: ${missingRequired.join(", ")}`);
      return;
    }

    try {
      await createDocument.mutateAsync({
        template_id: template.id,
        company_id: selectedCompanyId || null,
        deal_id: selectedDealId || null,
        candidate_id: selectedCandidateId || null,
        title: documentTitle,
        content: previewContent,
        field_values: fieldValues,
        status: 'draft',
      });
      navigate("/admin/documents");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${documentTitle || 'Dokument'}</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>${previewContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/documents")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Generera dokument</h1>
            <p className="text-muted-foreground">
              Välj mall, fyll i fält och skapa ett nytt dokument
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} disabled={!previewContent}>
            <Download className="h-4 w-4 mr-2" />
            Skriv ut / PDF
          </Button>
          <Button onClick={handleGenerate} disabled={createDocument.isPending}>
            <Check className="h-4 w-4 mr-2" />
            Spara dokument
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Välj mall</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en mall..." />
                </SelectTrigger>
                <SelectContent>
                  {templates?.filter(t => t.is_active).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t.name}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {templateTypeLabels[t.template_type]}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {template && (
                <div className="space-y-2">
                  <Label>Dokumenttitel</Label>
                  <Input
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Titel för det sparade dokumentet"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Koppla till</CardTitle>
              <CardDescription>Valfritt: koppla dokumentet till företag, affär eller konsult</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Företag
                </Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj företag..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Inget valt</SelectItem>
                    {companies?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCompanyId && deals && deals.length > 0 && (
                <div className="space-y-2">
                  <Label>Affär</Label>
                  <Select value={selectedDealId} onValueChange={setSelectedDealId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj affär..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ingen vald</SelectItem>
                      {deals.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Konsult
                </Label>
                <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj konsult..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ingen vald</SelectItem>
                    {candidates?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} - {c.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {template && template.fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fyll i fält</CardTitle>
                <CardDescription>
                  Fält markerade med * är obligatoriska
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        value={fieldValues[field.name] || ''}
                        onChange={(e) => setFieldValues({ ...fieldValues, [field.name]: e.target.value })}
                        placeholder={`Ange ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                        value={fieldValues[field.name] || ''}
                        onChange={(e) => setFieldValues({ ...fieldValues, [field.name]: e.target.value })}
                        placeholder={`Ange ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Förhandsgranskning</CardTitle>
              <CardDescription>
                Så här kommer dokumentet att se ut
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!template ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4" />
                  <p>Välj en mall för att se förhandsgranskning</p>
                </div>
              ) : (
                <div className="border rounded-lg p-8 bg-white dark:bg-zinc-950 min-h-[600px] whitespace-pre-wrap font-serif leading-relaxed">
                  {previewContent || (
                    <span className="text-muted-foreground italic">
                      Fyll i fält för att se dokumentet
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
