import { motion } from "framer-motion";

interface TitleSlideProps {
  clientName: string;
  projectTitle: string;
  content?: Record<string, unknown>;
}

export function TitleSlide({ clientName, projectTitle, content }: TitleSlideProps) {
  const label = (content?.label as string) || "Affärsförslag för";
  const subtitle = (content?.subtitle as string) || "";
  const backgroundImage = content?.backgroundImage as string | undefined;
  const scrollHint = (content?.scrollHint as string) || "Tryck → för att fortsätta";

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#101829] to-[#151d2e]">
      {/* Background image if provided */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Client label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-6"
        >
          {label}
        </motion.p>

        {/* Client name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight mb-8"
        >
          {clientName}
        </motion.h1>

        {/* Project title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-white/70 font-light"
        >
          {projectTitle}
        </motion.p>

        {/* Optional subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg text-white/50 font-light mt-4"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-12"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/30 text-xs tracking-widest uppercase"
        >
          {scrollHint}
        </motion.div>
      </motion.div>
    </div>
  );
}
