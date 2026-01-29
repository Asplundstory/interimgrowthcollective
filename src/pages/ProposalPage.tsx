import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useProposal, useRecordProposalView } from "@/hooks/useProposal";
import { ProposalSlideshow } from "@/components/proposal/ProposalSlideshow";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProposalPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: proposal, isLoading, error } = useProposal(slug || "");
  const recordView = useRecordProposalView(proposal?.id);
  const hasRecordedView = useRef(false);

  // Record view on first load
  useEffect(() => {
    if (proposal && !hasRecordedView.current) {
      hasRecordedView.current = true;
      recordView.mutate();
    }
  }, [proposal, recordView]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#151d2e]">
        <div className="text-center">
          <Skeleton className="w-64 h-8 mb-4 bg-white/10" />
          <Skeleton className="w-48 h-4 bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#151d2e]">
        <div className="text-center px-8">
          <h1 className="text-4xl font-medium text-white mb-4">
            Förslaget kunde inte hittas
          </h1>
          <p className="text-white/60 mb-8">
            Länken kan ha upphört att gälla eller så finns inte förslaget längre.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-md transition-colors"
          >
            Gå till startsidan
          </a>
        </div>
      </div>
    );
  }

  // Check if proposal has expired
  if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#151d2e]">
        <div className="text-center px-8">
          <h1 className="text-4xl font-medium text-white mb-4">
            Förslaget har upphört att gälla
          </h1>
          <p className="text-white/60 mb-8">
            Kontakta oss för ett uppdaterat förslag.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-md transition-colors"
          >
            Kontakta oss
          </a>
        </div>
      </div>
    );
  }

  return <ProposalSlideshow proposal={proposal} />;
}
