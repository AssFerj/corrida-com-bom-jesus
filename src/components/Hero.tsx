"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { AlarmClock, CalendarDays, FileText, Flag, HandHeart, Ruler } from "lucide-react";
import { Countdown } from "./Countdown";
import { blurIn, ease, fadeUp, stagger } from "@/lib/motion";

const chips = [
  { icon: CalendarDays, text: "15 de Novembro de 2026", color: "text-secondary-container" },
  { icon: AlarmClock, text: "Largada às 06:00h", color: "text-primary-container" },
  { icon: Ruler, text: "3km & 5km (Masc/Fem)", color: "text-tertiary" },
  { icon: HandHeart, text: "R$ 10,00 + 1kg de Alimento", color: "text-secondary" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="inicio" className="relative w-full overflow-hidden bg-surface-container-lowest pt-20">
      {/* Fitas diagonais (estética da referência) */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {[
          { cls: "right-[42%] w-3 bg-secondary-container shadow-[0_0_20px_rgba(255,174,0,0.6)]", d: 0.2 },
          { cls: "right-[40%] w-10 bg-primary-container shadow-[0_0_35px_rgba(255,87,8,0.7)]", d: 0.35 },
          { cls: "right-[39%] w-4 bg-surface-container-lowest", d: 0.5 },
        ].map((r, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: r.d, duration: 1.1, ease }}
            className={`absolute -top-20 h-[140%] origin-top -rotate-12 ${r.cls}`}
          />
        ))}
      </div>

      {/* Fita diagonal no mobile */}
      <motion.div
        initial={{ x: "120%" }}
        animate={{ x: 0 }}
        transition={{ delay: 0.3, duration: 1, ease }}
        className="pointer-events-none absolute -right-16 top-24 h-6 w-72 rotate-[-25deg] bg-velocity opacity-80 shadow-[0_0_30px_rgba(255,87,8,0.6)] lg:hidden"
      />

      {/* Retícula halftone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.6, duration: 1.5 }}
        className="halftone pointer-events-none absolute bottom-0 left-0 h-96 w-96 text-primary [mask-image:radial-gradient(circle_at_bottom_left,black,transparent_70%)]"
      />

      <div className="relative z-20 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:min-h-[720px] lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Coluna de texto */}
          <motion.div
            style={{ y: textY, opacity: fade }}
            variants={stagger(0.12, 0.3)}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start gap-4 lg:col-span-7"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-1 shadow-inner"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-container" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-container" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Edição Inaugural • 15/11/2026
              </span>
            </motion.div>

            <div className="flex flex-col">
              <motion.span
                variants={fadeUp}
                className="font-display text-base font-bold uppercase tracking-widest text-secondary sm:text-xl"
              >
                1ª Corrida com Bom Jesus dos Navegantes
              </motion.span>
              <h1 className="font-display text-[44px] font-bold uppercase leading-[48px] tracking-tight text-white drop-shadow-md sm:text-6xl sm:leading-[64px] lg:text-[72px] lg:leading-[76px]">
                <motion.span variants={blurIn} className="inline-block">
                  Supere seus
                </motion.span>{" "}
                <motion.span
                  variants={{
                    hidden: { opacity: 0, x: -40, skewX: -20 },
                    show: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.8, ease } },
                  }}
                  className="text-gradient inline-block pr-2"
                >
                  Limites!
                </motion.span>
              </h1>
            </div>

            <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Uma manhã memorável de fé, superação e esporte em celebração aos festejos de Bom Jesus dos
              Navegantes. Venha correr e praticar a solidariedade.
            </motion.p>

            <motion.div variants={fadeUp} className="w-full">
              <Countdown />
            </motion.div>

            <motion.div variants={fadeUp} className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <motion.a
                href="#inscricao"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-velocity group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 font-display text-base font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_25px_rgba(255,87,8,0.5)] transition-shadow hover:shadow-[0_12px_32px_rgba(255,174,0,0.7)]"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/30" />
                <Flag size={18} className="transition-transform group-hover:-rotate-12" />
                Garantir Vaga (R$ 10,00)
              </motion.a>
              <motion.a
                href="#cronograma"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-bright bg-surface-container-high px-6 py-3 font-display text-base font-semibold uppercase tracking-[0.08em] text-on-surface transition-colors hover:border-primary-container hover:bg-surface-bright"
              >
                <FileText size={18} />
                Ver Regulamento
              </motion.a>
            </motion.div>

            <motion.div
              variants={stagger(0.08)}
              className="grid grid-cols-1 gap-x-5 gap-y-2 pt-2 text-sm text-on-surface-variant min-[420px]:grid-cols-2 sm:flex sm:flex-wrap"
            >
              {chips.map(({ icon: Icon, text, color }) => (
                <motion.div key={text} variants={fadeUp} className="flex items-center gap-1.5">
                  <Icon size={16} className={color} />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Imagem do atleta */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease }}
            className="relative flex h-[420px] w-full items-center justify-center sm:h-[520px] lg:col-span-5 lg:h-[620px]"
          >
            <div className="group relative h-full w-full overflow-hidden rounded-[1.5rem] bg-surface-container-low shadow-2xl">
              <motion.div style={{ y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src="/images/atleta.jpg"
                  alt="Atleta em posição de largada sob a luz dourada do amanhecer"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center saturate-110 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/60 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7, ease }}
                className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-[1.5rem] bg-surface-container-lowest/80 p-4 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary-container">
                    Circuito Oficial
                  </span>
                  <h4 className="font-display text-lg font-medium uppercase leading-tight text-white sm:text-xl">
                    Centro de Camocim
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-white sm:text-2xl">6:00 AM</span>
                  <span className="block text-[11px] font-semibold uppercase text-on-surface-variant sm:text-xs">
                    Concentração 05:15
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
