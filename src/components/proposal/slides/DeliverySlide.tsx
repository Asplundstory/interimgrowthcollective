import { motion, type Variants } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

interface DeliverySlideProps {
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

export function DeliverySlide({ content }: DeliverySlideProps) {
  const timeline = (content?.timeline as string) || "Start inom 2 veckor";
  const location = (content?.location as string) || "On-site hos er";
  const scope = (content?.scope as string) || "Heltid eller deltid efter behov";
  const duration = (content?.duration as string) || "3-6 månader (flexibelt)";
  const phases = (content?.phases as Array<{ title: string; description: string }>) || [
    { title: "Onboarding", description: "Första veckan – lära känna teamet och verksamheten" },
    { title: "Genomförande", description: "Leverans enligt överenskommelse" },
    { title: "Överlämning", description: "Dokumentation och kunskapsöverföring" },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl px-8 w-full"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8 text-center"
        >
          Leverans
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-16 text-center"
        >
          Upplägg & tidslinje
        </motion.h2>

        {/* Key details */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-white/40 mb-1">Start</p>
              <p className="text-white">{timeline}</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-white/40 mb-1">Plats</p>
              <p className="text-white">{location}</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-white/40 mb-1">Längd</p>
              <p className="text-white">{duration}</p>
            </div>
          </div>
        </motion.div>

        {/* Phases timeline */}
        <motion.div variants={itemVariants} className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-8 bottom-8 w-px bg-white/20 hidden md:block" />
          
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-6 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-sm font-medium z-10">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-medium text-white mb-1">{phase.title}</h3>
                  <p className="text-white/60">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
