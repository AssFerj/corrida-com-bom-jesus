import * as motion from "motion/react-client";
import { CalendarClock, HandHeart, Gauge, Medal } from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const cards = [
  {
    icon: CalendarClock,
    label: "Data & Horário",
    title: "15/11/2026 • 06:00",
    text: "Domingo festivo. Concentração às 05:15 na Arena de Largada.",
    iconCls: "text-primary-container group-hover:bg-primary-container group-hover:text-white",
  },
  {
    icon: HandHeart,
    label: "Inscrição Solidária",
    title: "R$ 10,00 + 1kg Alimento",
    text: "100% dos alimentos arrecadados serão entregues às famílias assistidas pela Paróquia.",
    iconCls: "text-secondary-container group-hover:bg-secondary-container group-hover:text-white",
  },
  {
    icon: Gauge,
    label: "Percurso",
    title: "3km",
    text: "Corra no seu tempo e no seu ritmo, apenas finalize todo o percurso e aproveite o evento.",
    iconCls: "text-tertiary group-hover:bg-tertiary-container group-hover:text-white",
  },
  {
    icon: Medal,
    label: "Chegada",
    title: "Hidratação & Frutas",
    text: "Ao final da corrida haverá hidratação e frutas para todos os concluintes.",
    iconCls: "text-secondary group-hover:bg-secondary group-hover:text-surface-container-lowest",
  },
];

export function Highlights() {
  return (
    <section id="sobre-o-evento" className="relative w-full bg-surface-container-low pb-14 pt-20 sm:pb-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-container"
            >
              <span className="h-0.5 w-6 bg-current" /> Informações Oficiais
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-[28px] font-semibold uppercase leading-9 tracking-wide text-white md:text-[32px] md:leading-[38px]"
            >
              Destaques da Prova
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-md text-sm text-on-surface-variant">
            Planejada para receber desde corredores experientes em busca de recordes, iniciantes ou famílias em
            busca de uma prática esportiva saudável.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map(({ icon: Icon, label, title, text, iconCls }) => (
            <motion.article
              key={label}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/5 bg-surface-container p-6 shadow-lg transition-colors hover:bg-surface-container-high"
            >
              {/* Slash de destaque no hover */}
              <span className="bg-velocity absolute left-0 top-0 h-1 w-0 transition-all duration-500 group-hover:w-full" />
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-highest shadow-md transition-all duration-300 group-hover:rotate-[360deg] ${iconCls}`}
              >
                <Icon size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</span>
                <h3 className="font-display text-xl font-medium uppercase text-white">{title}</h3>
                <p className="text-sm text-on-surface-variant">{text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
