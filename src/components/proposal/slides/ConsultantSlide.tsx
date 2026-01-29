import { motion, type Variants } from "framer-motion";
import type { ProposalConsultant } from "@/hooks/useProposal";

interface ConsultantSlideProps {
  consultants: ProposalConsultant[];
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

export function ConsultantSlide({ consultants }: ConsultantSlideProps) {
  // Show placeholder if no consultants
  const displayConsultants = consultants.length > 0 ? consultants : [
    {
      id: "placeholder-1",
      proposal_id: "",
      name: "Anna Lindström",
      role: "Brand Strategist",
      photo_url: null,
      bio: "15 års erfarenhet av varumärkesbyggande för både startups och etablerade bolag.",
      expertise: ["Varumärkesstrategi", "Positionering", "Storytelling"],
      availability: "Tillgänglig januari 2025",
      sort_order: 0,
    },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl px-8 w-full"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-[11px] tracking-[0.2em] uppercase text-accent mb-8 text-center"
        >
          Föreslagna konsulter
        </motion.p>

        {/* Main headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-16 text-center"
        >
          Era tilltänkta experter
        </motion.h2>

        {/* Consultants grid */}
        <div className={`grid gap-8 ${displayConsultants.length === 1 ? 'max-w-lg mx-auto' : displayConsultants.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {displayConsultants.map((consultant) => (
            <motion.div
              key={consultant.id}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center"
            >
              {/* Photo placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                {consultant.photo_url ? (
                  <img
                    src={consultant.photo_url}
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-medium text-accent">
                    {consultant.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name and role */}
              <h3 className="text-xl font-medium text-white mb-1">
                {consultant.name}
              </h3>
              <p className="text-accent text-sm mb-4">{consultant.role}</p>

              {/* Bio */}
              {consultant.bio && (
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {consultant.bio}
                </p>
              )}

              {/* Expertise tags */}
              {consultant.expertise && consultant.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {consultant.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Availability */}
              {consultant.availability && (
                <p className="text-[10px] tracking-wider uppercase text-white/40">
                  {consultant.availability}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
