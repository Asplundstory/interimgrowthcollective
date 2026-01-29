import { motion, type Variants } from "framer-motion";

interface ChallengeSlideProps {
  title?: string;
  challenges?: string[];
  content?: Record<string, unknown>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function ChallengeSlide({ title, challenges, content }: ChallengeSlideProps) {
  const slideTitle = title || (content?.title as string) || "Er utmaning";
  const slideItems = challenges || (content?.challenges as string[]) || [
    "Behov av strategisk kompetens på interimbasis",
    "Snabbt införande utan lång rekryteringsprocess",
    "Någon som förstår er bransch och kultur",
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl px-8"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8"
        >
          Utmaning
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-16"
        >
          {slideTitle}
        </motion.h2>

        {/* Challenges list */}
        <div className="space-y-6">
          {slideItems.map((challenge, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-6"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed pt-1">
                {challenge}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
