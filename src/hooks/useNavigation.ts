import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "./useAdmin";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface NavItem {
  name: string;
  href: string;
}

const defaultNavigation: NavItem[] = [
  { name: "För företag", href: "/for-companies" },
  { name: "För yrkespersoner", href: "/for-creators" },
  { name: "Områden", href: "/areas" },
  { name: "Om oss", href: "/about" },
  { name: "Inspiration", href: "/insights" },
];

export function useNavigation() {
  const [items, setItems] = useState<NavItem[]>(defaultNavigation);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchNavigation = async () => {
      const { data, error } = await supabase
        .from("cms_navigation")
        .select("items")
        .eq("menu_id", "main")
        .maybeSingle();

      if (!error && data?.items && Array.isArray(data.items)) {
        setItems(data.items as unknown as NavItem[]);
      }
      setIsLoading(false);
    };

    fetchNavigation();
  }, []);

  const updateNavigation = async (newItems: NavItem[]) => {
    const { data: existing } = await supabase
      .from("cms_navigation")
      .select("id")
      .eq("menu_id", "main")
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("cms_navigation")
        .update({ items: newItems as unknown as Json })
        .eq("menu_id", "main");
      error = result.error;
    } else {
      const result = await supabase
        .from("cms_navigation")
        .insert([{ menu_id: "main", items: newItems as unknown as Json }]);
      error = result.error;
    }

    if (error) {
      toast.error("Kunde inte spara menyn");
      return false;
    }

    setItems(newItems);
    toast.success("Menyn har sparats");
    return true;
  };

  return {
    items,
    isLoading,
    isAdmin,
    updateNavigation,
  };
}
