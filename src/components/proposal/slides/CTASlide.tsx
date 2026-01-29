import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASlideProps {
  clientName: string;
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

export function CTASlide({ clientName, content }: CTASlideProps) {
  const contactEmail = (content?.email as string) || "hej@interimgrowth.se";
  const contactPhone = (content?.phone as string) || "+46 70 123 45 67";
  const bookingUrl = (content?.bookingUrl as string) || "/contact";
  const nextSteps = (content?.nextSteps as string[]) || [
    "Boka ett uppföljande samtal",
    "Träffa de föreslagna konsulterna",
    "Bestäm upplägg och start",
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl px-8 w-full text-center relative z-10"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8"
        >
          Nästa steg
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-6"
        >
          Redo att ta steget?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-white/60 mb-12"
        >
          Vi ser fram emot att arbeta med {clientName}
        </motion.p>

        {/* Next steps */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 mb-12"
        >
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 text-left">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-white/80">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mb-12">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-md"
            onClick={() => window.open(bookingUrl, "_blank")}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Boka samtal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Contact info */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/50"
        >
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
            {contactEmail}
          </a>
          <span className="hidden md:inline text-white/20">|</span>
          <a
            href={`tel:${contactPhone}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            {contactPhone}
          </a>
        </motion.div>

        {/* Thank you */}
        <motion.p
          variants={itemVariants}
          className="text-white/30 text-sm mt-12"
        >
          Tack för att ni överväger Interim Growth Collective
        </motion.p>
      </motion.div>
    </div>
  );
}
