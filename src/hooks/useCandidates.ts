import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CandidateStatus = 'new' | 'screening' | 'interview' | 'approved' | 'rejected';

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  availability: string | null;
  hourly_rate: number | null;
  notes: string | null;
  q1_feeling: string | null;
  q2_structure: string | null;
  q3_pressure: string | null;
  code_of_conduct_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CandidateReference {
  id: string;
  candidate_id: string;
  name: string;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface CandidateApplication {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cv_file?: File;
  q1_feeling: string;
  q2_structure: string;
  q3_pressure: string;
  code_of_conduct_accepted: boolean;
  references?: Array<{
    name: string;
    company?: string;
    title?: string;
    email?: string;
    phone?: string;
  }>;
}

export function useCandidates(status?: CandidateStatus) {
  return useQuery({
    queryKey: ["candidates", status],
    queryFn: async () => {
      let query = supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (status) {
        query = query.eq("status", status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Candidate[];
    },
  });
}

export function useCandidate(id: string | undefined) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Candidate;
    },
    enabled: !!id,
  });
}

export function useCandidateReferences(candidateId: string | undefined) {
  return useQuery({
    queryKey: ["candidate-references", candidateId],
    queryFn: async () => {
      if (!candidateId) return [];
      const { data, error } = await supabase
        .from("candidate_references")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at");
      
      if (error) throw error;
      return data as CandidateReference[];
    },
    enabled: !!candidateId,
  });
}

export function useSubmitCandidateApplication() {
  return useMutation({
    mutationFn: async (application: CandidateApplication) => {
      let cvUrl: string | null = null;

      // Upload CV if provided
      if (application.cv_file) {
        const fileExt = application.cv_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("candidate-cvs")
          .upload(fileName, application.cv_file);
        
        if (uploadError) throw uploadError;
        cvUrl = fileName;
      }

      // Insert candidate
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .insert({
          first_name: application.first_name,
          last_name: application.last_name,
          email: application.email,
          phone: application.phone || null,
          role: application.role,
          linkedin_url: application.linkedin_url || null,
          portfolio_url: application.portfolio_url || null,
          cv_url: cvUrl,
          q1_feeling: application.q1_feeling,
          q2_structure: application.q2_structure,
          q3_pressure: application.q3_pressure,
          code_of_conduct_accepted: application.code_of_conduct_accepted,
        })
        .select()
        .single();
      
      if (candidateError) throw candidateError;

      // Insert references if provided
      if (application.references && application.references.length > 0) {
        const referencesData = application.references.map((ref) => ({
          candidate_id: candidate.id,
          name: ref.name,
          company: ref.company || null,
          title: ref.title || null,
          email: ref.email || null,
          phone: ref.phone || null,
        }));

        const { error: refError } = await supabase
          .from("candidate_references")
          .insert(referencesData);
        
        if (refError) throw refError;
      }

      return candidate as Candidate;
    },
    onError: (error) => {
      console.error("Application error:", error);
      toast.error("Kunde inte skicka ansökan. Försök igen.");
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Candidate> & { id: string }) => {
      const { data, error } = await supabase
        .from("candidates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Candidate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate", data.id] });
      toast.success("Kandidat uppdaterad");
    },
    onError: (error) => {
      toast.error("Kunde inte uppdatera kandidat: " + error.message);
    },
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("candidates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("Kandidat borttagen");
    },
    onError: (error) => {
      toast.error("Kunde inte ta bort kandidat: " + error.message);
    },
  });
}

export const candidateStatusLabels: Record<CandidateStatus, string> = {
  new: 'Ny',
  screening: 'Granskning',
  interview: 'Intervju',
  approved: 'Godkänd',
  rejected: 'Avvisad',
};

export const candidateStatusColors: Record<CandidateStatus, string> = {
  new: 'bg-blue-500',
  screening: 'bg-yellow-500',
  interview: 'bg-purple-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};
