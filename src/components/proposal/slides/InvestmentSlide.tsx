import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

interface InvestmentSlideProps {
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

export function InvestmentSlide({ content }: InvestmentSlideProps) {
  const price = (content?.price as string) || "75 000 - 95 000 kr";
  const period = (content?.period as string) || "per månad";
  const includes = (content?.includes as string[]) || [
    "Dedikerad konsult på plats",
    "Löpande uppföljning och stöd",
    "Flexibla villkor",
    "Ingen rekryteringsavgift",
  ];
  const terms = (content?.terms as string) || "Fakturering månadsvis. Uppsägningstid 2 veckor.";
  const note = (content?.note as string) || "Exakt pris beror på konsultens erfarenhet och uppdragets omfattning.";

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl px-8 w-full"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8 text-center"
        >
          Investering
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-4 text-center"
        >
          {price}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-white/60 mb-12 text-center"
        >
          {period}
        </motion.p>

        {/* Includes card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-8"
        >
          <h3 className="text-lg font-medium text-white mb-6 text-center">
            Detta ingår
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {includes.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <p className="text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <p className="text-white/50 text-sm">{terms}</p>
          <p className="text-white/40 text-xs">{note}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
