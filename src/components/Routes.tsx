import * as motion from "motion/react-client";
import { Clock, Droplet, Mountain, Award, MapIcon } from "lucide-react";
import { SectionHeading } from "./ui";
import { drawPath, fadeLeft, fadeUp, stagger } from "@/lib/motion";

type Course = {
  tag: string;
  tagCls: string;
  title: string;
  big: string;
  bigCls: string;
  text: string;
  features: { icon: typeof Clock; text: string; cls: string }[];
  color: string;
  cta: string;
  ctaPrimary?: boolean;
};

const course: Course = {
  tag: "Caminhada • Corrida • Todas as idades",
  tagCls: "bg-primary-container/20 text-primary",
  title: "Circuito 3 KM",
  big: "3K",
  bigCls: "text-primary-container/30",
  text: "Um percurso plano pela Beira Mar e pelo centro de Camocim, perfeito para quem quer correr, caminhar, celebrar com a família ou estrear no universo das corridas de rua.",
  features: [
    { icon: Clock, text: "Largada às 06:00h", cls: "text-primary-container" },
    { icon: Droplet, text: "Ponto d'água no km 1.5", cls: "text-tertiary" },
    { icon: Mountain, text: "Ganho altimétrico: 8m (Plano)", cls: "text-secondary-container" },
    { icon: Award, text: "Medalha para quem concluir", cls: "text-secondary" },
  ],
  color: "#ff5708",
  cta: "Inscrever nos 3km • R$ 10,00",
  ctaPrimary: true,
};

// Circuito real no centro de Camocim (traçado a partir do mapa do percurso)
const ROUTE =
  "M 52,16 L 75,6 L 88,10 L 278,128 L 460,210 L 680,342 L 735,348 L 838,400 L 1000,512 L 898,602 L 790,693 L 670,795 L 655,795 L 618,760 L 592,730 L 612,720 L 662,688 L 525,560 L 404,452 L 555,328 L 507,290 L 363,200 L 245,120 L 180,90 Z";
const COAST = "M 120,-70 L 150,0 L 300,98 L 470,192 L 690,318 L 845,382 L 1010,478 L 1060,496";
const SEA = `${COAST} L 1060,-70 Z`;

function CourseCard({ c }: { c: Course }) {
  return (
    <motion.article
      variants={fadeLeft}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-4xl border border-white/5 bg-surface-container p-6 shadow-xl sm:p-10"
    >
      {/* Slash lateral */}
      <span
        className="absolute -right-10 -top-10 h-40 w-6 rotate-[35deg] opacity-0 transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: c.color }}
      />
      <motion.div variants={stagger(0.08, 0.3)} className="flex flex-col gap-4">
        <motion.div variants={fadeUp} className="flex items-start justify-between gap-3">
          <div>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide sm:text-xs ${c.tagCls}`}>
              {c.tag}
            </span>
            <h3 className="mt-2 font-display text-[28px] font-semibold uppercase leading-9 text-white sm:text-[32px]">
              {c.title}
            </h3>
          </div>
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: 2, rotate: -10 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8 } },
            }}
            className={`font-display text-5xl font-bold leading-none transition-transform duration-500 group-hover:scale-110 ${c.bigCls}`}
          >
            {c.big}
          </motion.span>
        </motion.div>

        <motion.p variants={fadeUp} className="text-sm leading-relaxed text-on-surface-variant">
          {c.text}
        </motion.p>

        <motion.div variants={stagger(0.08)} className="grid grid-cols-1 gap-3 py-1 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {c.features.map(({ icon: Icon, text, cls }) => (
            <motion.div key={text} variants={fadeUp} className="flex items-center gap-2 text-on-surface">
              <Icon size={20} className={`shrink-0 ${cls}`} />
              <span className="text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          variants={fadeUp}
          href="#inscricao"
          whileTap={{ scale: 0.97 }}
          className={`w-full rounded-full py-3 text-center text-sm font-medium uppercase tracking-wider text-white transition-all ${
            c.ctaPrimary
              ? "bg-velocity shadow-lg hover:shadow-[0_10px_30px_rgba(255,87,8,0.5)] hover:brightness-110"
              : "bg-surface-container-high hover:bg-surface-bright"
          }`}
        >
          {c.cta}
        </motion.a>
      </motion.div>
    </motion.article>
  );
}

function CircuitMap() {
  // Ponto de largada/chegada (canto da Beira Mar)
  const start = { x: 52, y: 16 };

  const landmarks = [
    { cx: 262, cy: 124, label: "BEIRA MAR", lx: 300, ly: 92 },
    { cx: 642, cy: 272, label: "PÍER DE CAMOCIM", lx: 668, ly: 250 },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col gap-4 rounded-4xl border border-white/5 bg-surface-container-low p-4 shadow-2xl sm:p-6"
    >
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <MapIcon className="text-primary-container" size={22} />
          <span className="font-display text-lg font-medium uppercase text-white sm:text-xl">
            Mapa do Circuito • Beira Mar de Camocim
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-primary-container" /> Largada/Chegada
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-primary-fixed" /> Pontos de Referência
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-surface-container-lowest">
        <motion.svg
          viewBox="0 -70 1060 890"
          fill="none"
          className="mx-auto block h-auto max-h-[620px] w-full"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          role="img"
          aria-label="Mapa do circuito pelo centro de Camocim, com largada na Beira Mar, passagem pela orla e pelo Píer"
        >
          <defs>
            {/* Malha de ruas, alinhada com a orla */}
            <pattern id="streets" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(29)">
              <path d="M0 0H64M0 0V64" stroke="#2a2a2c" strokeWidth="2" />
            </pattern>
            <linearGradient id="sea" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#00363d" stopOpacity="0.55" />
              <stop offset="1" stopColor="#00363d" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Ruas do centro */}
          <motion.rect
            x="0"
            y="-70"
            width="1060"
            height="890"
            fill="url(#streets)"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 0.8, transition: { duration: 1.2 } } }}
          />

          {/* Mar / orla */}
          <motion.path
            d={SEA}
            fill="url(#sea)"
            variants={{ hidden: { opacity: 0, y: -30 }, show: { opacity: 1, y: 0, transition: { duration: 1.2 } } }}
          />
          <motion.path
            d={COAST}
            stroke="#00daf3"
            strokeWidth={2}
            strokeOpacity={0.35}
            variants={drawPath}
          />
          {/* Píer */}
          <motion.path
            d="M 632,284 L 664,250"
            stroke="#00daf3"
            strokeOpacity={0.5}
            strokeWidth={6}
            strokeLinecap="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 1, duration: 0.6 } } }}
          />
          <text x="790" y="150" fill="#00daf3" opacity="0.5" fontSize="20" fontWeight="600" className="font-sans">
            ÁGUAS DE BOM JESUS
          </text>

          {/* Pista */}
          <motion.path
            d={ROUTE}
            stroke="#353437"
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2.2, ease: "easeInOut" } } }}
          />
          <motion.g variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.8, duration: 0.6 } } }}>
            <path
              d={ROUTE}
              stroke="#ff5708"
              strokeWidth={9}
              strokeDasharray="14 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-dash"
            />
            {/* Corredor percorrendo o circuito */}
            <circle r="11" fill="#ffae00" opacity="0.35">
              <animateMotion dur="16s" repeatCount="indefinite" path={ROUTE} />
            </circle>
            <circle r="6" fill="#ffffff">
              <animateMotion dur="16s" repeatCount="indefinite" path={ROUTE} />
            </circle>
          </motion.g>

          {/* Pontos de referência */}
          {landmarks.map((m, i) => (
            <motion.g
              key={m.label}
              style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                show: { scale: 1, opacity: 1, transition: { delay: 2.2 + i * 0.2, type: "spring", stiffness: 400, damping: 15 } },
              }}
            >
              <circle cx={m.cx} cy={m.cy} r="11" fill="#ffdbcf" />
              <circle cx={m.cx} cy={m.cy} r="4.5" fill="#131315" />
              <text x={m.lx} y={m.ly} fill="#ffdbcf" fontWeight="600" className="font-sans text-[30px] md:text-[20px]">
                {m.label}
              </text>
            </motion.g>
          ))}

          {/* Largada / chegada */}
          <motion.g
            style={{ transformOrigin: `${start.x}px ${start.y}px` }}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              show: { scale: 1, opacity: 1, transition: { delay: 2, type: "spring", stiffness: 400, damping: 15 } },
            }}
          >
            <circle cx={start.x} cy={start.y} r="18" fill="none" stroke="#ff5708" strokeWidth="3">
              <animate attributeName="r" values="18;40" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx={start.x} cy={start.y} r="18" fill="#ff5708" />
            <circle cx={start.x} cy={start.y} r="7" fill="#ffffff" />
          </motion.g>
          <motion.text
            x="30"
            y="-30"
            fill="#ffffff"
            fontWeight="700"
            className="font-display text-[36px] md:text-[26px]"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 2.4, duration: 0.5 } } }}
          >
            PONTO DE LARGADA / CHEGADA (06:00)
          </motion.text>
        </motion.svg>
      </div>
    </motion.div>
  );
}

export function Routes() {
  return (
    <section id="percursos" className="relative w-full overflow-hidden bg-surface py-16 sm:py-20">
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="bg-velocity pointer-events-none absolute -right-20 -top-10 h-12 w-80 rotate-45"
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Circuito Oficial"
          title="O Percurso"
          description="Percurso totalmente plano, aferido e cercado pela brisa marítima, pensado para o conforto de quem corre e de quem caminha."
        />
        <CourseCard c={course} />
        <CircuitMap />
      </div>
    </section>
  );
}
