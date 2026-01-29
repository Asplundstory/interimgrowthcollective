import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Eye, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDocumentTemplate,
  useCreateTemplate,
  useUpdateTemplate,
  templateTypeLabels,
  extractPlaceholders,
  fillTemplate,
  type TemplateField,
  type TemplateType,
} from "@/hooks/useDocuments";
import { toast } from "sonner";

const defaultFields: TemplateField[] = [];

export default function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const { data: template, isLoading } = useDocumentTemplate(isNew ? undefined : id);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [name, setName] = useState("");
  const [templateType, setTemplateType] = useState<TemplateType>("other");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [fields, setFields] = useState<TemplateField[]>(defaultFields);
  const [isActive, setIsActive] = useState(true);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setName(template.name);
      setTemplateType(template.template_type);
      setDescription(template.description || "");
      setContent(template.content);
      setFields(template.fields);
      setIsActive(template.is_active);
    }
  }, [template]);

  const detectedPlaceholders = extractPlaceholders(content);
  const unusedPlaceholders = detectedPlaceholders.filter(
    (p) => !fields.some((f) => f.name === p)
  );

  const addField = (placeholder?: string) => {
    const newField: TemplateField = {
      id: crypto.randomUUID(),
      name: placeholder || `field_${fields.length + 1}`,
      label: placeholder ? placeholder.replace(/_/g, " ") : `Fält ${fields.length + 1}`,
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Mallnamn krävs");
      return;
    }
    if (!content.trim()) {
      toast.error("Mallinnehåll krävs");
      return;
    }

    const templateData = {
      name,
      template_type: templateType,
      description: description || null,
      content,
      fields,
      is_active: isActive,
    };

    try {
      if (isNew) {
        await createTemplate.mutateAsync(templateData);
      } else {
        await updateTemplate.mutateAsync({ id: id!, ...templateData });
      }
      navigate("/admin/documents");
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const previewContent = fillTemplate(content, previewValues);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/documents")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? "Ny dokumentmall" : "Redigera mall"}
            </h1>
            <p className="text-muted-foreground">
              Skapa mallar med dynamiska fält som fylls i vid generering
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Aktiv</Label>
          </div>
          <Button onClick={handleSave} disabled={createTemplate.isPending || updateTemplate.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Spara
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mallinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Mallnamn *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="T.ex. Standardavtal konsult"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Typ</Label>
                  <Select value={templateType} onValueChange={(v) => setTemplateType(v as TemplateType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templateTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beskrivning</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kort beskrivning av mallen"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mallinnehåll</CardTitle>
              <CardDescription>
                Använd {"{{fältnamn}}"} för dynamiska fält. Exempel: {"{{kundnamn}}"}, {"{{datum}}"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit">
                <TabsList className="mb-4">
                  <TabsTrigger value="edit">Redigera</TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Förhandsgranska
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`UPPDRAGSAVTAL

Mellan {{kundforetag}} (org.nr {{kundorgnr}}), nedan kallat "Kunden", och Interim Growth Collective AB (559xxx-xxxx), nedan kallat "IGC", har följande avtal träffats.

1. UPPDRAG
IGC åtar sig att till Kunden tillhandahålla {{roll}} med start {{startdatum}}.

2. ERSÄTTNING
Ersättning för uppdraget utgår med {{timpris}} SEK per timme exklusive moms.

...`}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  {unusedPlaceholders.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Upptäckta fält utan definition:</p>
                      <div className="flex flex-wrap gap-2">
                        {unusedPlaceholders.map((p) => (
                          <Badge
                            key={p}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => addField(p)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-lg p-6 min-h-[400px] bg-white dark:bg-zinc-950 whitespace-pre-wrap font-serif">
                    {previewContent || <span className="text-muted-foreground italic">Inga värden ifyllda</span>}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Fields sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fältdefinitioner</CardTitle>
                <Button variant="outline" size="sm" onClick={() => addField()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Lägg till
                </Button>
              </div>
              <CardDescription>
                Definiera vilka fält som ska fyllas i
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Inga fält definierade. Lägg till fält manuellt eller klicka på upptäckta fält ovan.
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value.replace(/\s/g, '_') })}
                          placeholder="faltnamn"
                          className="flex-1 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Visningsnamn"
                      />
                      <div className="flex items-center gap-2">
                        <Select
                          value={field.type}
                          onValueChange={(v) => updateField(field.id, { type: v as TemplateField['type'] })}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Lång text</SelectItem>
                            <SelectItem value="number">Nummer</SelectItem>
                            <SelectItem value="date">Datum</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <Switch
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(v) => updateField(field.id, { required: v })}
                          />
                          <Label htmlFor={`required-${field.id}`} className="text-xs">Obligatorisk</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testa med exempelvärden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <Label className="text-xs">{field.label}</Label>
                    <Input
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      value={previewValues[field.name] || ''}
                      onChange={(e) => setPreviewValues({ ...previewValues, [field.name]: e.target.value })}
                      placeholder={`Ange ${field.label.toLowerCase()}`}
                      className="text-sm"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
