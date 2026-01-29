import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import type { Proposal, ProposalSlide, ProposalConsultant } from "@/hooks/useProposal";

import {
  TitleSlide,
  AboutSlide,
  ChallengeSlide,
  SolutionSlide,
  ConsultantSlide,
  DeliverySlide,
  InvestmentSlide,
  CTASlide,
} from "@/components/proposal/slides";

interface ProposalPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: {
    client_name: string;
    project_title: string;
    slides: ProposalSlide[];
    consultants: ProposalConsultant[];
  };
}

export function ProposalPreview({ open, onOpenChange, proposal }: ProposalPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const slides = proposal.slides || [];
  const consultants = proposal.consultants || [];

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onOpenChange(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, nextSlide, prevSlide, isFullscreen, onOpenChange]);

  // Reset slide when opening
  useEffect(() => {
    if (open) {
      setCurrentSlide(0);
    }
  }, [open]);

  const renderSlide = (slide: ProposalSlide) => {
    const content = slide.content || {};
    
    switch (slide.slide_type) {
      case "title":
        return (
          <TitleSlide
            clientName={proposal.client_name}
            projectTitle={proposal.project_title}
            content={content}
          />
        );
      case "about":
        return <AboutSlide content={content} />;
      case "challenge":
        return (
          <ChallengeSlide
            title={slide.title || undefined}
            content={content}
          />
        );
      case "solution":
        return (
          <SolutionSlide
            title={slide.title || undefined}
            content={content}
          />
        );
      case "consultants":
        return <ConsultantSlide consultants={consultants} />;
      case "delivery":
        return <DeliverySlide content={content} />;
      case "investment":
        return <InvestmentSlide content={content} />;
      case "cta":
        return <CTASlide clientName={proposal.client_name} content={content} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Okänd slide-typ: {slide.slide_type}</p>
          </div>
        );
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`
          p-0 gap-0 overflow-hidden
          ${isFullscreen 
            ? "max-w-[100vw] w-screen h-screen max-h-screen rounded-none" 
            : "max-w-5xl w-[90vw] h-[80vh]"
          }
        `}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-white">
            <span className="text-sm opacity-70">Förhandsgranskning</span>
            <h3 className="font-medium">{proposal.client_name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slide content */}
        <div className="relative w-full h-full bg-[#0b1220]">
          <AnimatePresence mode="wait">
            {currentSlideData && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {renderSlide(currentSlideData)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-40"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentSlide < slides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-40"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Progress dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-6 right-6 text-white/60 text-sm z-40">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
