import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company_id: string;
  company_name: string;
}

export interface ClientSession {
  id: string;
  user: ClientUser;
}

interface ClientDocument {
  id: string;
  company_id: string;
  document_type: 'contract' | 'policy' | 'invoice' | 'agreement' | 'other';
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
}

interface SignedDocument {
  id: string;
  title: string;
  content: string;
  status: string;
  signed_at: string | null;
  signed_by: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  company_id: string;
  deal_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string | null;
  wint_reference: string | null;
  created_at: string;
}

const CLIENT_SESSION_KEY = "igc_client_session";

export function useClientAuth() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(CLIENT_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      } catch (e) {
        localStorage.removeItem(CLIENT_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const requestMagicLink = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-magic-link/request", {
        body: { email },
      });

      if (error) throw error;
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("Magic link error:", error);
      return { success: false, message: error.message || "Ett fel uppstod" };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-magic-link/verify", {
        body: { email, otp },
      });

      if (error) throw error;

      if (data.success && data.session) {
        setSession(data.session);
        localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(data.session));
        return { success: true };
      }

      return { success: false, message: data.error || "Verifiering misslyckades" };
    } catch (error: any) {
      console.error("Verify error:", error);
      return { success: false, message: error.message || "Ogiltig eller utgången kod" };
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(CLIENT_SESSION_KEY);
    toast.success("Du har loggat ut");
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    user: session?.user,
    requestMagicLink,
    verifyOtp,
    logout,
  };
}

export function useClientProposals(companyId: string | undefined) {
  return useQuery({
    queryKey: ["client-proposals", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      // Get deals linked to this company that have proposals
      const { data: deals, error } = await supabase
        .from("deals")
        .select(`
          id,
          title,
          status,
          value,
          currency,
          proposal_id,
          proposals (
            id,
            project_title,
            client_name,
            status,
            slug,
            created_at,
            updated_at
          )
        `)
        .eq("company_id", companyId)
        .not("proposal_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return deals || [];
    },
    enabled: !!companyId,
  });
}

export function useClientDocuments(companyId: string | undefined) {
  return useQuery({
    queryKey: ["client-documents", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from("client_documents")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ClientDocument[];
    },
    enabled: !!companyId,
  });
}

export function useClientInvoices(companyId: string | undefined) {
  return useQuery({
    queryKey: ["client-invoices", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!companyId,
  });
}

export function useClientSignedDocuments(companyId: string | undefined) {
  return useQuery({
    queryKey: ["client-signed-documents", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from("generated_documents")
        .select("id, title, content, status, signed_at, signed_by, created_at")
        .eq("company_id", companyId)
        .eq("status", "signed")
        .order("signed_at", { ascending: false });

      if (error) throw error;
      return data as SignedDocument[];
    },
    enabled: !!companyId,
  });
}

export const documentTypeLabels: Record<string, string> = {
  contract: "Kontrakt",
  policy: "Policy",
  invoice: "Faktura",
  agreement: "Avtal",
  other: "Övrigt",
};

export const invoiceStatusLabels: Record<string, string> = {
  draft: "Utkast",
  sent: "Skickad",
  paid: "Betald",
  overdue: "Förfallen",
};

export const invoiceStatusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-500",
  paid: "bg-green-500/10 text-green-500",
  overdue: "bg-red-500/10 text-red-500",
};
