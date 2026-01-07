import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "./useAdmin";
import { toast } from "sonner";

export interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  published: boolean;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAdmin();

  const fetchInsights = useCallback(async () => {
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching insights:", error);
      return;
    }

    setInsights(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const createInsight = async (insight: Omit<Insight, "id">) => {
    const { data, error } = await supabase
      .from("insights")
      .insert([insight])
      .select()
      .single();

    if (error) {
      toast.error("Kunde inte skapa artikeln");
      return null;
    }

    toast.success("Artikeln har skapats");
    await fetchInsights();
    return data;
  };

  const updateInsight = async (id: string, updates: Partial<Insight>) => {
    const { error } = await supabase
      .from("insights")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte uppdatera artikeln");
      return false;
    }

    toast.success("Artikeln har sparats");
    await fetchInsights();
    return true;
  };

  const deleteInsight = async (id: string) => {
    const { error } = await supabase
      .from("insights")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte ta bort artikeln");
      return false;
    }

    toast.success("Artikeln har tagits bort");
    await fetchInsights();
    return true;
  };

  const getInsightBySlug = async (slug: string): Promise<Insight | null> => {
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  };

  return {
    insights,
    isLoading,
    isAdmin,
    createInsight,
    updateInsight,
    deleteInsight,
    getInsightBySlug,
    refetch: fetchInsights,
  };
}
