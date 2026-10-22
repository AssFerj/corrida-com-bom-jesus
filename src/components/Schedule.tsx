"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Flag } from "lucide-react";
import { SectionHeading } from "./ui";
import { ease } from "@/lib/motion";

const events = [
  { time: "05:00", title: "Abertura da Arena", text: "Abertura dos portões, guarda-volumes gratuito e som ambiente esportivo.", color: "#ffae00" },
  { time: "05:30", title: "Aquecimento Coletivo", text: "Alongamento dinâmico e ativação muscular comandados por profissionais de educação física.", color: "#ff5708" },
  { time: "05:50", title: "Alinhamento & Bênção", text: "Entrada nos pelotões de largada e tradicional bênção solene de Bom Jesus dos Navegantes aos corredores.", color: "#ffd395" },
  { time: "06:00 em ponto", title: "Largada Oficial 5KM & 3KM", text: "Sinal sonoro oficial com disparo de largada unificada para todas as modalidades.", color: "#ff5708", highlight: true },
  { time: "07:15", title: "Cerimônia de Premiação", text: "Subida ao pódio dos 5 primeiros colocados geral Masc/Fem e entrega de troféus por categoria etária.", color: "#00daf3" },
  { time: "08:30", title: "Show Acústico & Sorteios", text: "Música ao vivo na orla, sorteio de brindes dos patrocinadores e confraternização geral.", color: "#e5beb2" },
];

export function Schedule() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="cronograma" className="relative w-full overflow-x-clip bg-surface py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Programação Oficial"
          title={
            <>
              Cronograma do Domingo <span className="text-gradient whitespace-nowrap">• 15/11/2026</span>
            </>
          }
          description="Horários rigorosamente cronometrados para o máximo conforto e bem-estar de todos os atletas participantes."
        />

        <div ref={ref} className="relative flex flex-col gap-8 md:gap-6">
          {/* Linha base + linha de progresso */}
          <div className="absolute bottom-4 left-6 top-4 w-0.5 -translate-x-1/2 bg-surface-container-highest md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-4 left-6 top-4 w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-secondary-container via-primary-container to-tertiary md:left-1/2"
          />

          {events.map((ev, i) => {
            const left = i % 2 === 0; // lado do conteúdo no desktop
            return (
              <div key={ev.time} className="relative flex items-center pl-16 md:pl-0">
                {/* Ponto na linha */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
                  className="absolute left-6 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
                >
                  {ev.highlight ? (
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-container shadow-[0_0_20px_rgba(255,87,8,0.8)]">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary-container/60" />
                      <Flag size={16} className="relative text-white" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest shadow-lg">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ev.color }} />
                    </span>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: left ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease }}
                  className={`w-full md:w-5/12 ${left ? "md:mr-auto md:text-right" : "md:ml-auto"} ${
                    ev.highlight
                      ? "rounded-[1.5rem] border border-primary-container/30 bg-surface-container p-4 shadow-[0_10px_40px_rgba(255,87,8,0.15)]"
                      : ""
                  }`}
                >
                  <span
                    className={`font-display font-bold uppercase ${ev.highlight ? "text-2xl" : "text-xl"}`}
                    style={{ color: ev.color }}
                  >
                    {ev.time}
                  </span>
                  <h4 className="font-display text-xl font-medium uppercase text-white">{ev.title}</h4>
                  <p className="text-sm text-on-surface-variant">{ev.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
