import type { Variants } from "motion/react";

// Objetos simples (serializáveis), podem ser passados por Server Components.
export const ease = [0.22, 1, 0.36, 1] as const;

export const viewportOnce = { once: true, amount: 0.25 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 18 } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
  show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.9, ease } },
};

export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0 round 1.5rem)" },
  show: { clipPath: "inset(0 0% 0 0 round 1.5rem)", transition: { duration: 1.1, ease } },
};

export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.8, ease: "easeInOut" } },
};

export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
