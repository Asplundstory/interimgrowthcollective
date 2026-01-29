import { motion, type Variants } from "framer-motion";
import { Users, Clock, Heart } from "lucide-react";

interface SolutionSlideProps {
  title?: string;
  solutions?: Array<{ icon: string; title: string; description: string }>;
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

const iconMap: Record<string, typeof Users> = {
  users: Users,
  clock: Clock,
  heart: Heart,
};

export function SolutionSlide({ title, solutions, content }: SolutionSlideProps) {
  const slideTitle = title || (content?.title as string) || "Vår lösning";
  const slideItems = solutions || (content?.solutions as Array<{ icon: string; title: string; description: string }>) || [
    {
      icon: "users",
      title: "Rätt person",
      description: "En noggrant utvald konsult som matchar era behov och kultur",
    },
    {
      icon: "clock",
      title: "Snabb start",
      description: "Från första kontakt till konsult på plats inom 1-2 veckor",
    },
    {
      icon: "heart",
      title: "Engagemang",
      description: "Någon som genuint bryr sig om ert varumärke och era mål",
    },
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
          Lösning
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-16 text-center"
        >
          {slideTitle}
        </motion.h2>

        {/* Solutions grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {slideItems.map((solution, index) => {
            const IconComponent = iconMap[solution.icon] || Users;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  {solution.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {solution.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
