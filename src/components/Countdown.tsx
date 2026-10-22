"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Timer } from "lucide-react";

// Largada: 15/11/2026 às 06:00 (horário de Brasília)
const RACE_DATE = new Date("2026-11-15T06:00:00-03:00").getTime();

type Parts = { days: number; hours: number; mins: number; secs: number };

function getParts(): Parts {
  const diff = Math.max(0, RACE_DATE - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1000),
  };
}

function Digit({ value, highlight }: { value: number | null; highlight?: boolean }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <span className="relative block h-[38px] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`block font-display text-[32px] font-semibold leading-[38px] tabular-nums ${
            highlight ? "text-primary-container" : "text-white"
          }`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown() {
  // Começa vazio no servidor e só calcula no navegador (evita divergência de hidratação)
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units: { key: keyof Parts; label: string }[] = [
    { key: "days", label: "Dias" },
    { key: "hours", label: "Horas" },
    { key: "mins", label: "Min" },
    { key: "secs", label: "Seg" },
  ];

  return (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-4xl bg-surface-container/90 p-4 shadow-xl backdrop-blur-md">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-container">
        <Timer size={16} className="animate-pulse" /> Contagem Regressiva para a Largada
      </span>
      <div className="grid grid-cols-4 gap-2 text-center">
        {units.map((u, i) => (
          <motion.div
            key={u.key}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
            className="flex flex-col rounded-2xl bg-surface-container-lowest px-1 py-2"
          >
            <Digit value={parts ? parts[u.key] : null} highlight={u.key === "secs"} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-xs">
              {u.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
