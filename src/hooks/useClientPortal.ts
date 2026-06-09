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
  token: string;
  expiresAt: string;
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

async function portalCall<T = unknown>(
  token: string,
  action: string,
): Promise<{ data?: T; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("client-portal", {
      body: { action },
      headers: { "x-portal-token": token },
    });
    if (error) return { error: error.message };
    return { data: data?.data as T };
  } catch (e: any) {
    return { error: e?.message || "Network error" };
  }
}

export function useClientAuth() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CLIENT_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ClientSession;
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setSession(parsed);
        } else {
          localStorage.removeItem(CLIENT_SESSION_KEY);
        }
      } catch {
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
      return { success: false, message: error.message || "Ett fel uppstod" };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-magic-link/verify", {
        body: { email, otp },
      });
      if (error) throw error;

      if (data?.success && data.sessionToken && data.user) {
        const newSession: ClientSession = {
          token: data.sessionToken,
          expiresAt: data.expiresAt,
          user: data.user,
        };
        setSession(newSession);
        localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(newSession));
        return { success: true };
      }

      return { success: false, message: data?.error || "Verifiering misslyckades" };
    } catch (error: any) {
      return { success: false, message: error.message || "Ogiltig eller utgången kod" };
    }
  }, []);

  const logout = useCallback(async () => {
    if (session?.token) {
      await supabase.functions.invoke("client-portal", {
        body: { action: "logout" },
        headers: { "x-portal-token": session.token },
      }).catch(() => null);
    }
    setSession(null);
    localStorage.removeItem(CLIENT_SESSION_KEY);
    toast.success("Du har loggat ut");
  }, [session]);

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

export function useClientProposals(token: string | undefined) {
  return useQuery({
    queryKey: ["client-proposals", token],
    queryFn: async () => {
      if (!token) return [];
      const { data, error } = await portalCall<any[]>(token, "proposals");
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!token,
  });
}

export function useClientDocuments(token: string | undefined) {
  return useQuery({
    queryKey: ["client-documents", token],
    queryFn: async () => {
      if (!token) return [];
      const { data, error } = await portalCall<ClientDocument[]>(token, "documents");
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!token,
  });
}

export function useClientInvoices(token: string | undefined) {
  return useQuery({
    queryKey: ["client-invoices", token],
    queryFn: async () => {
      if (!token) return [];
      const { data, error } = await portalCall<Invoice[]>(token, "invoices");
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!token,
  });
}

export function useClientSignedDocuments(token: string | undefined) {
  return useQuery({
    queryKey: ["client-signed-documents", token],
    queryFn: async () => {
      if (!token) return [];
      const { data, error } = await portalCall<SignedDocument[]>(token, "signed_documents");
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!token,
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
