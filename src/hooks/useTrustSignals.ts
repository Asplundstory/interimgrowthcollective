import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "./useAdmin";
import { toast } from "sonner";
import type { Testimonial, ClientLogo } from "@/components/editorial/TrustSignals";

interface DbTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  quote_en: string | null;
  role_en: string | null;
  sort_order: number;
  published: boolean;
}

interface DbClientLogo {
  id: string;
  name: string;
  logo_url: string;
  href: string | null;
  sort_order: number;
  published: boolean;
}

export function useTrustSignals(language: string = "sv") {
  const [testimonials, setTestimonials] = useState<(Testimonial & { id: string })[]>([]);
  const [clientLogos, setClientLogos] = useState<(ClientLogo & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAdmin();

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return;
    }

    const mapped = (data as DbTestimonial[]).map((t) => ({
      id: t.id,
      quote: language === "en" && t.quote_en ? t.quote_en : t.quote,
      author: t.author,
      role: language === "en" && t.role_en ? t.role_en : t.role,
      company: t.company,
    }));

    setTestimonials(mapped);
  };

  const fetchClientLogos = async () => {
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching client logos:", error);
      return;
    }

    const mapped = (data as DbClientLogo[]).map((l) => ({
      id: l.id,
      name: l.name,
      logoUrl: l.logo_url,
      href: l.href || undefined,
    }));

    setClientLogos(mapped);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchTestimonials(), fetchClientLogos()]);
      setIsLoading(false);
    };
    fetchAll();
  }, [language]);

  const createTestimonial = async (testimonial: Omit<DbTestimonial, "id" | "sort_order" | "published">) => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert([testimonial])
      .select()
      .single();

    if (error) {
      toast.error("Kunde inte skapa testimonial");
      return null;
    }

    toast.success("Testimonial skapad");
    await fetchTestimonials();
    return data;
  };

  const updateTestimonial = async (id: string, updates: Partial<DbTestimonial>) => {
    const { error } = await supabase
      .from("testimonials")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte uppdatera testimonial");
      return false;
    }

    toast.success("Testimonial uppdaterad");
    await fetchTestimonials();
    return true;
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte ta bort testimonial");
      return false;
    }

    toast.success("Testimonial borttagen");
    await fetchTestimonials();
    return true;
  };

  const createClientLogo = async (logo: Omit<DbClientLogo, "id" | "sort_order" | "published">) => {
    const { data, error } = await supabase
      .from("client_logos")
      .insert([logo])
      .select()
      .single();

    if (error) {
      toast.error("Kunde inte skapa logotyp");
      return null;
    }

    toast.success("Logotyp skapad");
    await fetchClientLogos();
    return data;
  };

  const updateClientLogo = async (id: string, updates: Partial<DbClientLogo>) => {
    const { error } = await supabase
      .from("client_logos")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte uppdatera logotyp");
      return false;
    }

    toast.success("Logotyp uppdaterad");
    await fetchClientLogos();
    return true;
  };

  const deleteClientLogo = async (id: string) => {
    const { error } = await supabase
      .from("client_logos")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Kunde inte ta bort logotyp");
      return false;
    }

    toast.success("Logotyp borttagen");
    await fetchClientLogos();
    return true;
  };

  return {
    testimonials,
    clientLogos,
    isLoading,
    isAdmin,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    createClientLogo,
    updateClientLogo,
    deleteClientLogo,
    refetch: () => Promise.all([fetchTestimonials(), fetchClientLogos()]),
  };
}
