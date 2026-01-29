import { motion, type Variants } from "framer-motion";

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

export function AboutSlide() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl px-8 text-center"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8"
        >
          Om oss
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-8"
        >
          Interim Growth Collective
        </motion.h2>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-2xl md:text-3xl text-white/80 font-light mb-12"
        >
          Människor med känsla
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-white/20 mx-auto mb-12"
        />

        {/* Value proposition */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
        >
          Vi förmedlar interim-specialister inom brand, marknadsföring, 
          kommunikation och kreativa discipliner. Våra konsulter går på plats 
          hos er och blir en naturlig del av teamet – med engagemang och känsla.
        </motion.p>

        {/* Three pillars */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 mt-16"
        >
          {[
            { label: "Interim", value: "Flexibla lösningar" },
            { label: "On-site", value: "Del av ert team" },
            { label: "Känsla", value: "Engagerade experter" },
          ].map((pillar) => (
            <div key={pillar.label} className="text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-accent mb-2">
                {pillar.label}
              </p>
              <p className="text-white/70 text-sm">{pillar.value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
