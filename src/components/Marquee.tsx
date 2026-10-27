import * as motion from "motion/react-client";

const words = ["Fé", "Superação", "Solidariedade", "3KM", "Medalha para Todos", "15/11/2026", "Largada 06:00", "Bom Jesus dos Navegantes"];

/** Faixa inclinada com texto rolando continuamente. */
export function Marquee() {
  const items = [...words, ...words];
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-20 -my-5 -rotate-2 overflow-hidden bg-velocity py-3 shadow-[0_10px_40px_rgba(255,87,8,0.35)]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-xl font-bold uppercase tracking-widest text-surface-container-lowest sm:text-2xl">
            {w}
            <span className="inline-block h-3 w-3 rotate-45 bg-surface-container-lowest" />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
