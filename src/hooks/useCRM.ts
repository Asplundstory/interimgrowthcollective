import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
export interface Company {
  id: string;
  name: string;
  org_number: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin_url: string | null;
  is_primary: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export type DealStatus = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  company_id: string | null;
  contact_id: string | null;
  proposal_id: string | null;
  title: string;
  value: number | null;
  currency: string;
  status: DealStatus;
  probability: number;
  expected_close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  company?: Company;
  contact?: Contact;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note';

export interface DealActivity {
  id: string;
  deal_id: string;
  user_id: string;
  activity_type: ActivityType;
  description: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// Companies hooks
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Company[];
    },
  });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Omit<Partial<Company>, 'id' | 'created_at' | 'updated_at'> & { name: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Företag skapat");
    },
    onError: (error) => {
      toast.error("Kunde inte skapa företag: " + error.message);
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Company> & { id: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", data.id] });
      toast.success("Företag uppdaterat");
    },
    onError: (error) => {
      toast.error("Kunde inte uppdatera företag: " + error.message);
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Företag borttaget");
    },
    onError: (error) => {
      toast.error("Kunde inte ta bort företag: " + error.message);
    },
  });
}

// Contacts hooks
export function useContacts(companyId?: string) {
  return useQuery({
    queryKey: ["contacts", companyId],
    queryFn: async () => {
      let query = supabase
        .from("contacts")
        .select("*, company:companies(*)")
        .order("first_name");
      
      if (companyId) {
        query = query.eq("company_id", companyId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as (Contact & { company: Company | null })[];
    },
  });
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("contacts")
        .select("*, company:companies(*)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Contact & { company: Company | null };
    },
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Omit<Partial<Contact>, 'id' | 'created_at' | 'updated_at'> & { first_name: string; last_name: string }) => {
      const { data, error } = await supabase
        .from("contacts")
        .insert(contact)
        .select()
        .single();
      
      if (error) throw error;
      return data as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Kontakt skapad");
    },
    onError: (error) => {
      toast.error("Kunde inte skapa kontakt: " + error.message);
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Contact;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", data.id] });
      toast.success("Kontakt uppdaterad");
    },
    onError: (error) => {
      toast.error("Kunde inte uppdatera kontakt: " + error.message);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Kontakt borttagen");
    },
    onError: (error) => {
      toast.error("Kunde inte ta bort kontakt: " + error.message);
    },
  });
}

// Deals hooks
export function useDeals(status?: DealStatus) {
  return useQuery({
    queryKey: ["deals", status],
    queryFn: async () => {
      let query = supabase
        .from("deals")
        .select("*, company:companies(*), contact:contacts(*)")
        .order("created_at", { ascending: false });
      
      if (status) {
        query = query.eq("status", status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as (Deal & { company: Company | null; contact: Contact | null })[];
    },
  });
}

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("deals")
        .select("*, company:companies(*), contact:contacts(*)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Deal & { company: Company | null; contact: Contact | null };
    },
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deal: Omit<Partial<Deal>, 'id' | 'created_at' | 'updated_at'> & { title: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .insert(deal)
        .select()
        .single();
      
      if (error) throw error;
      return data as Deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Affär skapad");
    },
    onError: (error) => {
      toast.error("Kunde inte skapa affär: " + error.message);
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deal> & { id: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Deal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deal", data.id] });
      toast.success("Affär uppdaterad");
    },
    onError: (error) => {
      toast.error("Kunde inte uppdatera affär: " + error.message);
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Affär borttagen");
    },
    onError: (error) => {
      toast.error("Kunde inte ta bort affär: " + error.message);
    },
  });
}

// Deal Activities hooks
export function useDealActivities(dealId: string | undefined) {
  return useQuery({
    queryKey: ["deal-activities", dealId],
    queryFn: async () => {
      if (!dealId) return [];
      const { data, error } = await supabase
        .from("deal_activities")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as DealActivity[];
    },
    enabled: !!dealId,
  });
}

export function useCreateDealActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Omit<Partial<DealActivity>, 'id' | 'created_at'> & { deal_id: string; user_id: string; activity_type: ActivityType }) => {
      const { data, error } = await supabase
        .from("deal_activities")
        .insert(activity)
        .select()
        .single();
      
      if (error) throw error;
      return data as DealActivity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deal-activities", data.deal_id] });
      toast.success("Aktivitet tillagd");
    },
    onError: (error) => {
      toast.error("Kunde inte lägga till aktivitet: " + error.message);
    },
  });
}

// Status labels
export const dealStatusLabels: Record<DealStatus, string> = {
  lead: 'Lead',
  qualified: 'Kvalificerad',
  proposal: 'Offert skickad',
  negotiation: 'Förhandling',
  won: 'Vunnen',
  lost: 'Förlorad',
};

export const activityTypeLabels: Record<ActivityType, string> = {
  call: 'Samtal',
  email: 'Email',
  meeting: 'Möte',
  note: 'Anteckning',
};
