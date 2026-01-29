import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
}: SlideNavigationProps) {
  return (
    <>
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={currentSlide === 0}
        className={cn(
          "fixed left-4 top-1/2 -translate-y-1/2 z-50",
          "w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-sm border border-white/20",
          "flex items-center justify-center",
          "text-white/60 hover:text-white hover:bg-white/20",
          "transition-all duration-300",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
        aria-label="Föregående slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className={cn(
          "fixed right-4 top-1/2 -translate-y-1/2 z-50",
          "w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-sm border border-white/20",
          "flex items-center justify-center",
          "text-white/60 hover:text-white hover:bg-white/20",
          "transition-all duration-300",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
        aria-label="Nästa slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Gå till slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </>
  );
}
