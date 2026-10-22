import * as motion from "motion/react-client";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  eyebrowClass?: string;
  size?: "lg" | "xl";
};

/** Título de seção com "eyebrow" e animação em cascata. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowClass = "text-secondary-container",
  size = "xl",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`flex flex-col gap-2 ${centered ? "mx-auto max-w-2xl items-center text-center" : "items-start"}`}
    >
      <motion.span
        variants={fadeUp}
        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${eyebrowClass}`}
      >
        <span className="h-0.5 w-6 bg-current" />
        {eyebrow}
        {centered && <span className="h-0.5 w-6 bg-current" />}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className={`font-display font-bold uppercase tracking-wide text-white ${
          size === "xl"
            ? "text-[32px] leading-[38px] md:text-5xl md:leading-[54px]"
            : "text-[28px] leading-9 md:text-[32px] md:leading-[38px]"
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-on-surface-variant">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Marca da corrida (substitui o logo gerado). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5708" />
          <stop offset="1" stopColor="#ffae00" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="none" stroke="url(#logo-g)" strokeWidth="3" />
      {/* Onda náutica */}
      <path d="M8 31c4-3 8-3 12 0s8 3 12 0 6-2 8-1" fill="none" stroke="#00daf3" strokeWidth="2.5" strokeLinecap="round" />
      {/* Slashes de velocidade */}
      <path d="M17 26l8-14h6l-8 14z" fill="url(#logo-g)" />
      <path d="M26 26l5-9h4l-5 9z" fill="#ffd395" />
    </svg>
  );
}
