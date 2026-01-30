import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TemplateType = 'assignment' | 'employment' | 'code_of_conduct' | 'other';

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  template_type: TemplateType;
  description: string | null;
  content: string;
  fields: TemplateField[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedDocument {
  id: string;
  template_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  candidate_id: string | null;
  title: string;
  content: string;
  field_values: Record<string, string>;
  status: string;
  signed_at: string | null;
  signed_by: string | null;
  signer_ip: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const templateTypeLabels: Record<TemplateType, string> = {
  assignment: "Uppdragsavtal",
  employment: "Anställningsavtal",
  code_of_conduct: "Code of Conduct",
  other: "Övrigt",
};

// Templates
export function useDocumentTemplates() {
  return useQuery({
    queryKey: ["document-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(t => ({
        ...t,
        fields: (Array.isArray(t.fields) ? t.fields : []) as unknown as TemplateField[]
      })) as unknown as DocumentTemplate[];
    },
  });
}

export function useDocumentTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ["document-template", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        fields: (Array.isArray(data.fields) ? data.fields : []) as unknown as TemplateField[]
      } as unknown as DocumentTemplate;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Partial<DocumentTemplate>) => {
      const { data, error } = await supabase
        .from("document_templates")
        .insert([{
          name: template.name!,
          template_type: template.template_type || 'other',
          description: template.description,
          content: template.content || '',
          fields: JSON.parse(JSON.stringify(template.fields || [])),
          is_active: template.is_active ?? true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      toast.success("Mall skapad");
    },
    onError: (error) => {
      console.error("Create template error:", error);
      toast.error("Kunde inte skapa mall");
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...template }: Partial<DocumentTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from("document_templates")
        .update({
          name: template.name,
          template_type: template.template_type,
          description: template.description,
          content: template.content,
          fields: JSON.parse(JSON.stringify(template.fields || [])),
          is_active: template.is_active,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      queryClient.invalidateQueries({ queryKey: ["document-template", variables.id] });
      toast.success("Mall uppdaterad");
    },
    onError: (error) => {
      console.error("Update template error:", error);
      toast.error("Kunde inte uppdatera mall");
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("document_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates"] });
      toast.success("Mall raderad");
    },
    onError: (error) => {
      console.error("Delete template error:", error);
      toast.error("Kunde inte radera mall");
    },
  });
}

// Generated documents
export function useGeneratedDocuments(filters?: {
  companyId?: string;
  dealId?: string;
  candidateId?: string;
}) {
  return useQuery({
    queryKey: ["generated-documents", filters],
    queryFn: async () => {
      let query = supabase
        .from("generated_documents")
        .select(`
          *,
          document_templates (name, template_type),
          companies (name),
          deals (title),
          candidates (first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (filters?.companyId) {
        query = query.eq("company_id", filters.companyId);
      }
      if (filters?.dealId) {
        query = query.eq("deal_id", filters.dealId);
      }
      if (filters?.candidateId) {
        query = query.eq("candidate_id", filters.candidateId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (GeneratedDocument & {
        document_templates: { name: string; template_type: TemplateType } | null;
        companies: { name: string } | null;
        deals: { title: string } | null;
        candidates: { first_name: string; last_name: string } | null;
      })[];
    },
  });
}

export function useCreateGeneratedDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doc: Partial<GeneratedDocument>) => {
      const { data, error } = await supabase
        .from("generated_documents")
        .insert({
          template_id: doc.template_id,
          company_id: doc.company_id,
          deal_id: doc.deal_id,
          candidate_id: doc.candidate_id,
          title: doc.title!,
          content: doc.content!,
          field_values: doc.field_values || {},
          status: doc.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-documents"] });
      toast.success("Dokument skapat");
    },
    onError: (error) => {
      console.error("Create document error:", error);
      toast.error("Kunde inte skapa dokument");
    },
  });
}

export function useUpdateGeneratedDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...doc }: Partial<GeneratedDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from("generated_documents")
        .update({
          title: doc.title,
          content: doc.content,
          field_values: doc.field_values,
          status: doc.status,
          signed_at: doc.signed_at,
          signed_by: doc.signed_by,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-documents"] });
      toast.success("Dokument uppdaterat");
    },
    onError: (error) => {
      console.error("Update document error:", error);
      toast.error("Kunde inte uppdatera dokument");
    },
  });
}

// Helper to fill template with values
export function fillTemplate(content: string, values: Record<string, string>): string {
  let filled = content;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    filled = filled.replace(regex, value || '');
  });
  return filled;
}

// Extract field placeholders from template content
export function extractPlaceholders(content: string): string[] {
  const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}
