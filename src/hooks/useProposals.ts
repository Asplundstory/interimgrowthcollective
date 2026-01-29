import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Proposal, ProposalSlide, ProposalConsultant } from "./useProposal";

export function useProposals() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async (): Promise<Proposal[]> => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      client_name: string;
      project_title: string;
      slug: string;
      valid_until?: string;
    }) => {
      const { data: proposal, error } = await supabase
        .from("proposals")
        .insert({
          client_name: data.client_name,
          project_title: data.project_title,
          slug: data.slug,
          valid_until: data.valid_until || null,
          status: "draft" as const,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default slides
      const defaultSlides = [
        { slide_type: "title", sort_order: 0 },
        { slide_type: "about", sort_order: 1 },
        { slide_type: "challenge", sort_order: 2 },
        { slide_type: "solution", sort_order: 3 },
        { slide_type: "consultants", sort_order: 4 },
        { slide_type: "delivery", sort_order: 5 },
        { slide_type: "investment", sort_order: 6 },
        { slide_type: "cta", sort_order: 7 },
      ];

      const { error: slidesError } = await supabase
        .from("proposal_slides")
        .insert(
          defaultSlides.map((slide) => ({
            proposal_id: proposal.id,
            slide_type: slide.slide_type,
            sort_order: slide.sort_order,
            content: {},
          }))
        );

      if (slidesError) throw slidesError;

      return proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      client_name?: string;
      project_title?: string;
      status?: Proposal["status"];
      valid_until?: string | null;
    }) => {
      const { error } = await supabase
        .from("proposals")
        .update({
          client_name: data.client_name,
          project_title: data.project_title,
          status: data.status,
          valid_until: data.valid_until,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useUpdateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title?: string | null;
      content?: Record<string, unknown>;
    }) => {
      const { error } = await supabase
        .from("proposal_slides")
        .update({
          title: data.title,
          content: data.content as unknown as import("@/integrations/supabase/types").Json,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}

export function useCreateConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposal_id: string;
      name: string;
      role: string;
      bio?: string;
      photo_url?: string;
      expertise?: string[];
      availability?: string;
    }) => {
      // Get the next sort order
      const { data: existing } = await supabase
        .from("proposal_consultants")
        .select("sort_order")
        .eq("proposal_id", data.proposal_id)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

      const { data: consultant, error } = await supabase
        .from("proposal_consultants")
        .insert({
          proposal_id: data.proposal_id,
          name: data.name,
          role: data.role,
          bio: data.bio || null,
          photo_url: data.photo_url || null,
          expertise: data.expertise || [],
          availability: data.availability || null,
          sort_order: nextOrder,
        })
        .select()
        .single();

      if (error) throw error;
      return consultant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}

export function useUpdateConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      role?: string;
      bio?: string | null;
      photo_url?: string | null;
      expertise?: string[];
      availability?: string | null;
    }) => {
      const { error } = await supabase
        .from("proposal_consultants")
        .update({
          name: data.name,
          role: data.role,
          bio: data.bio,
          photo_url: data.photo_url,
          expertise: data.expertise,
          availability: data.availability,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}

export function useDeleteConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("proposal_consultants")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
  });
}
