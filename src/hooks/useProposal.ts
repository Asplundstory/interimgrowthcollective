import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProposalConsultant {
  id: string;
  proposal_id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  expertise: string[];
  availability: string | null;
  sort_order: number;
}

export interface ProposalSlide {
  id: string;
  proposal_id: string;
  slide_type: string;
  sort_order: number;
  title: string | null;
  content: Record<string, unknown>;
}

export interface Proposal {
  id: string;
  slug: string;
  client_name: string;
  project_title: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  view_count: number;
  last_viewed_at: string | null;
}

export interface ProposalWithDetails extends Proposal {
  slides: ProposalSlide[];
  consultants: ProposalConsultant[];
}

export function useProposal(slug: string) {
  return useQuery({
    queryKey: ["proposal", slug],
    queryFn: async (): Promise<ProposalWithDetails | null> => {
      // Fetch proposal
      const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (proposalError) throw proposalError;
      if (!proposal) return null;

      // Fetch slides and consultants in parallel
      const [slidesResult, consultantsResult] = await Promise.all([
        supabase
          .from("proposal_slides")
          .select("*")
          .eq("proposal_id", proposal.id)
          .order("sort_order"),
        supabase
          .from("proposal_consultants")
          .select("*")
          .eq("proposal_id", proposal.id)
          .order("sort_order"),
      ]);

      if (slidesResult.error) throw slidesResult.error;
      if (consultantsResult.error) throw consultantsResult.error;

      return {
        ...proposal,
        slides: (slidesResult.data || []).map((slide) => ({
          ...slide,
          content: slide.content as Record<string, unknown>,
        })),
        consultants: (consultantsResult.data || []).map((c) => ({
          ...c,
          expertise: c.expertise || [],
        })),
      };
    },
    enabled: !!slug,
  });
}

export function useRecordProposalView(proposalId: string | undefined) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!proposalId) return;
      
      // Fetch current view count and increment
      const { data: proposal, error: fetchError } = await supabase
        .from("proposals")
        .select("view_count")
        .eq("id", proposalId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newViewCount = (proposal?.view_count || 0) + 1;
      
      // Update view count and last viewed timestamp
      const { error } = await supabase
        .from("proposals")
        .update({
          view_count: newViewCount,
          last_viewed_at: new Date().toISOString(),
        })
        .eq("id", proposalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}

// Generate a cryptographically secure slug
export function generateProposalSlug(clientName: string): string {
  const sanitized = clientName
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  
  const year = new Date().getFullYear();
  const randomPart = crypto.randomUUID().split("-").slice(0, 2).join("");
  
  return `${sanitized}-${year}-${randomPart}`;
}
