import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideNavigation } from "./SlideNavigation";
import {
  TitleSlide,
  AboutSlide,
  ChallengeSlide,
  SolutionSlide,
  ConsultantSlide,
  DeliverySlide,
  InvestmentSlide,
  CTASlide,
} from "./slides";
import type { ProposalWithDetails, ProposalSlide } from "@/hooks/useProposal";

interface ProposalSlideshowProps {
  proposal: ProposalWithDetails;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

// Default slide order if none specified in database
const DEFAULT_SLIDE_TYPES = [
  "title",
  "about",
  "challenge",
  "solution",
  "consultants",
  "delivery",
  "investment",
  "cta",
];

export function ProposalSlideshow({ proposal }: ProposalSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Build slides array from database or use defaults
  const slideOrder = proposal.slides.length > 0
    ? proposal.slides.sort((a, b) => a.sort_order - b.sort_order)
    : DEFAULT_SLIDE_TYPES.map((type, index) => ({
        id: type,
        proposal_id: proposal.id,
        slide_type: type,
        sort_order: index,
        title: null,
        content: {},
      } as ProposalSlide));

  const totalSlides = slideOrder.length;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  }, [currentSlide, totalSlides]);

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const goPrevious = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  const currentSlideData = slideOrder[currentSlide];

  const renderSlide = (slide: ProposalSlide) => {
    switch (slide.slide_type) {
      case "title":
        return (
          <TitleSlide
            clientName={proposal.client_name}
            projectTitle={proposal.project_title}
          />
        );
      case "about":
        return <AboutSlide />;
      case "challenge":
        return (
          <ChallengeSlide
            title={slide.title || undefined}
            content={slide.content}
          />
        );
      case "solution":
        return (
          <SolutionSlide
            title={slide.title || undefined}
            content={slide.content}
          />
        );
      case "consultants":
        return <ConsultantSlide consultants={proposal.consultants} />;
      case "delivery":
        return <DeliverySlide content={slide.content} />;
      case "investment":
        return <InvestmentSlide content={slide.content} />;
      case "cta":
        return (
          <CTASlide
            clientName={proposal.client_name}
            content={slide.content}
          />
        );
      default:
        return (
          <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#151d2e]">
            <p className="text-white/50">Okänd slide-typ: {slide.slide_type}</p>
          </div>
        );
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0"
        >
          {renderSlide(currentSlideData)}
        </motion.div>
      </AnimatePresence>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrevious={goPrevious}
        onNext={goNext}
        onGoToSlide={goToSlide}
      />
    </div>
  );
}
