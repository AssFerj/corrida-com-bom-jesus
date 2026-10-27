import Image from "next/image";
import * as motion from "motion/react-client";
import { Medal, Flag, HandHeart, BadgeCheck, Info } from "lucide-react";
import { SectionHeading } from "./ui";
import { clipReveal, ease, fadeUp, popIn, stagger, viewportOnce } from "@/lib/motion";

const items = [
  { icon: Medal, cls: "text-secondary-container", title: "Medalha Finisher", text: "Peça exclusiva da 1ª edição, com fita personalizada do evento." },
  { icon: Flag, cls: "text-primary-container", title: "Entregue na Chegada", text: "Todos que concluírem os 3km recebem a medalha no pórtico." },
  { icon: BadgeCheck, cls: "text-tertiary", title: "Inscrição Confirmada", text: "Garanta a vaga com o Pix de R$ 10,00 e envie o comprovante." },
  { icon: HandHeart, cls: "text-secondary", title: "Corrida Solidária", text: "O 1kg de alimento de cada atleta vira doação para quem precisa." },
];

export function Kit() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-low py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow="Sua Recompensa"
            eyebrowClass="text-primary"
            title="Medalha de Participação"
            description="Cada atleta inscrito por apenas R$ 10,00 (+ 1kg de alimento) que completar o percurso leva para casa a medalha oficial, uma lembrança eterna dessa conquista."
          />

          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2"
          >
            {items.map(({ icon: Icon, cls, title, text }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="group flex items-start gap-3 rounded-[1.5rem] border border-white/5 bg-surface-container p-4 transition-colors hover:border-primary-container/40"
              >
                <Icon size={26} className={`mt-0.5 shrink-0 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 ${cls}`} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-wide text-white">{title}</span>
                  <span className="text-sm text-on-surface-variant">{text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="flex items-center gap-4 rounded-[1.5rem] border-l-4 border-secondary-container bg-surface-container-highest/60 p-4"
          >
            <Info size={30} className="shrink-0 text-secondary-container" />
            <div className="flex flex-col text-sm">
              <span className="text-xs font-bold uppercase text-white">Entrega do Alimento</span>
              <span className="text-on-surface-variant">
                Após a confirmação do Pix, entregue 1kg de alimento não-perecível no Salão Paroquial, de segunda a
                sexta, das 8h às 18h, até sexta-feira, 13/11.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Vitrine da medalha */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative isolate h-[420px] w-full lg:col-span-6 lg:h-[500px]"
        >
          <motion.div
            variants={clipReveal}
            className="group relative h-full w-full overflow-hidden rounded-[1.5rem] bg-surface-container shadow-2xl"
          >
            <motion.div
              variants={{ hidden: { scale: 1.3 }, show: { scale: 1, transition: { duration: 1.6, ease } } }}
              className="absolute inset-0"
            >
              <Image
                src="/images/medalha.png"
                alt="Medalha da 1ª Corrida de Bom Jesus dos Navegantes com fita amarela personalizada"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />

            <motion.div
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.7, ease } } }}
              className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-lowest/85 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Medal size={28} className="shrink-0 text-secondary-container" />
                <div>
                  <h4 className="font-display text-lg font-medium uppercase leading-tight text-white sm:text-xl">
                    Medalha Exclusiva
                  </h4>
                  <span className="text-sm text-on-surface-variant">Entregue a todos que concluírem os 3km</span>
                </div>
              </div>
              <motion.span
                variants={popIn}
                className="relative shrink-0 self-start overflow-hidden rounded-full bg-primary-container px-4 py-1 text-xs font-bold uppercase text-white sm:self-auto"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40" />
                100% Metal Fundido
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Moldura decorativa */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 30, y: 30 }, show: { opacity: 1, x: 0, y: 0, transition: { delay: 0.5, duration: 0.8 } } }}
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 hidden h-full w-full rounded-[1.5rem] border-2 border-primary-container/40 sm:block"
          />
        </motion.div>
      </div>
    </section>
  );
}
