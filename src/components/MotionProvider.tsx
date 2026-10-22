"use client";

import { MotionConfig } from "motion/react";

/** Respeita a preferência do sistema por menos movimento. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
