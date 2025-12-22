import { useState, useEffect } from "react";
import { getPageContent, PageContent } from "@/content/adapter";
import { pageContent as localContent } from "@/content/pages";

export function usePageContent() {
  const [content, setContent] = useState<PageContent>(localContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    getPageContent()
      .then((data) => {
        if (mounted && data) {
          setContent(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  return { content, isLoading };
}
