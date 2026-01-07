import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "./useAdmin";
import { Json } from "@/integrations/supabase/types";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep merge function
function deepMerge<T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === "object" &&
        target[key] !== null
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        );
      } else {
        (result as Record<string, unknown>)[key] = source[key];
      }
    }
  }
  
  return result;
}

// Set a nested value by path
function setNestedValue<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const result = { ...obj } as Record<string, unknown>;
  let current: Record<string, unknown> = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) };
    current = current[keys[i]] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
  return result as T;
}

export function useCmsContent<T extends Record<string, unknown>>(pageId: string, defaultContent: T) {
  const [content, setContent] = useState<T>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin, user } = useAdmin();

  // Fetch content from database
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("cms_pages")
          .select("content")
          .eq("page_id", pageId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching CMS content:", error);
        } else if (data?.content) {
          // Merge database content with defaults
          setContent(deepMerge(defaultContent, data.content as DeepPartial<T>));
        }
      } catch (err) {
        console.error("Error fetching CMS content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pageId]);

  // Update a specific field
  const updateField = useCallback(
    async (path: string, value: unknown): Promise<boolean> => {
      if (!isAdmin || !user) return false;

      setIsSaving(true);
      
      // Optimistically update local state
      const newContent = setNestedValue(content, path, value);
      setContent(newContent);

      try {
        // Check if page exists
        const { data: existing } = await supabase
          .from("cms_pages")
          .select("id, content")
          .eq("page_id", pageId)
          .maybeSingle();

        if (existing) {
          // Update existing
          const existingContent = (existing.content || {}) as Record<string, unknown>;
          const updatedContent = setNestedValue(existingContent as T, path, value);
          
          const { error } = await supabase
            .from("cms_pages")
            .update({
              content: updatedContent as unknown as Json,
              updated_by: user.id,
            })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // Insert new
          const newPageContent = setNestedValue({} as T, path, value);
          const { error } = await supabase
            .from("cms_pages")
            .insert({
              page_id: pageId,
              content: newPageContent as unknown as Json,
              updated_by: user.id,
            });

          if (error) throw error;
        }

        return true;
      } catch (err) {
        console.error("Error saving CMS content:", err);
        // Revert on error
        setContent(content);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [content, isAdmin, pageId, user]
  );

  // Update entire content object
  const updateContent = useCallback(
    async (newContent: Partial<T>): Promise<boolean> => {
      if (!isAdmin || !user) return false;

      setIsSaving(true);
      const merged = deepMerge(content, newContent as DeepPartial<T>);
      setContent(merged);

      try {
        const { data: existing } = await supabase
          .from("cms_pages")
          .select("id")
          .eq("page_id", pageId)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("cms_pages")
            .update({
              content: merged as unknown as Json,
              updated_by: user.id,
            })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("cms_pages")
            .insert({
              page_id: pageId,
              content: merged as unknown as Json,
              updated_by: user.id,
            });

          if (error) throw error;
        }

        return true;
      } catch (err) {
        console.error("Error saving CMS content:", err);
        setContent(content);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [content, isAdmin, pageId, user]
  );

  return {
    content,
    isLoading,
    isSaving,
    isAdmin,
    updateField,
    updateContent,
  };
}
