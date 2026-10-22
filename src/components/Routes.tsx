import * as motion from "motion/react-client";
import { Clock, Droplet, Mountain, Award, Gauge, Trophy, MapIcon, MoveHorizontal } from "lucide-react";
import { SectionHeading } from "./ui";
import { drawPath, fadeLeft, fadeRight, fadeUp, stagger, viewportOnce } from "@/lib/motion";

type Course = {
  tag: string;
  tagCls: string;
  title: string;
  big: string;
  bigCls: string;
  text: string;
  features: { icon: typeof Clock; text: string; cls: string }[];
  elevationLabel: string;
  elevationMax: string;
  color: string;
  path: string;
  points: [number, number][];
  cta: string;
  ctaPrimary?: boolean;
};

const courses: Course[] = [
  {
    tag: "Iniciantes • Caminhada • Corrida",
    tagCls: "bg-tertiary-container/20 text-tertiary",
    title: "Circuito 3 KM",
    big: "3K",
    bigCls: "text-on-surface-variant/30",
    text: "Perfeito para quem deseja participar da celebração, praticar atividade física leve ou estrear no universo das corridas de rua.",
    features: [
      { icon: Clock, text: "Largada às 06:00h", cls: "text-primary-container" },
      { icon: Droplet, text: "Ponto d'água no km 1.5", cls: "text-tertiary" },
      { icon: Mountain, text: "Ganho altimétrico: 8m (Plano)", cls: "text-secondary-container" },
      { icon: Award, text: "Medalha Finisher no pórtico", cls: "text-secondary" },
    ],
    elevationLabel: "Altimetria Suave (Km 0 → Km 3)",
    elevationMax: "Elevação Máx 12m",
    color: "#00daf3",
    path: "M 0,45 Q 100,40 200,32 T 400,42",
    points: [[200, 32]],
    cta: "Inscrever nos 3km • R$ 10,00",
  },
  {
    tag: "Competição • Ritmo • Pace",
    tagCls: "bg-primary-container/20 text-primary",
    title: "Circuito 5 KM",
    big: "5K",
    bigCls: "text-primary-container/30",
    text: "Percurso rápido e técnico pela orla com asfalto plano, propício para bater seu recorde pessoal (RP) com visual incrível da nossa cidade.",
    features: [
      { icon: Clock, text: "Largada às 06:00h", cls: "text-primary-container" },
      { icon: Droplet, text: "2 Pontos d'água (Km 2 & Km 4)", cls: "text-tertiary" },
      { icon: Gauge, text: "Chip Eletrônico de Precisão", cls: "text-secondary-container" },
      { icon: Trophy, text: "Troféus Geral & Faixa Etária", cls: "text-secondary" },
    ],
    elevationLabel: "Altimetria Rápida (Km 0 → Km 5)",
    elevationMax: "Elevação Máx 14m",
    color: "#ff5708",
    path: "M 0,46 Q 80,44 150,30 T 300,38 T 400,45",
    points: [
      [150, 30],
      [300, 38],
    ],
    cta: "Inscrever nos 5km • R$ 10,00",
    ctaPrimary: true,
  },
];

const ROUTE =
  "M 100,160 L 320,160 C 420,160 460,80 560,80 L 800,80 C 820,80 840,100 840,120 C 840,140 820,160 800,160 L 560,160 C 460,160 420,240 320,240 L 100,240 C 70,240 70,160 100,160 Z";

function CourseCard({ c, index }: { c: Course; index: number }) {
  return (
    <motion.article
      variants={index === 0 ? fadeLeft : fadeRight}
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

        <motion.div variants={stagger(0.08)} className="grid grid-cols-1 gap-3 py-1 min-[420px]:grid-cols-2">
          {c.features.map(({ icon: Icon, text, cls }) => (
            <motion.div key={text} variants={fadeUp} className="flex items-center gap-2 text-on-surface">
              <Icon size={20} className={`shrink-0 ${cls}`} />
              <span className="text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Altimetria */}
        <motion.div variants={fadeUp} className="flex w-full flex-col gap-1 rounded-4xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-on-surface-variant">
            <span>{c.elevationLabel}</span>
            <span className="font-bold" style={{ color: index === 0 ? "#ffd395" : c.color }}>
              {c.elevationMax}
            </span>
          </div>
          <motion.svg
            viewBox="0 0 400 60"
            fill="none"
            className="h-12 w-full"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <defs>
              <linearGradient id={`elev-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={c.color} stopOpacity="0.35" />
                <stop offset="1" stopColor={c.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${c.path} L 400,60 L 0,60 Z`}
              fill={`url(#elev-${index})`}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.2, duration: 0.8 } } }}
            />
            <motion.path d={c.path} stroke={c.color} strokeWidth={3} strokeLinecap="round" variants={drawPath} />
            {c.points.map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={4}
                fill={c.color}
                variants={{
                  hidden: { scale: 0 },
                  show: { scale: 1, transition: { delay: 1 + i * 0.3, type: "spring", stiffness: 400 } },
                }}
              />
            ))}
          </motion.svg>
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
  const markers = [
    { cx: 100, cy: 160, r: 14, fill: "#ff5708", inner: true },
    { cx: 450, cy: 120, r: 10, fill: "#00daf3", inner: true },
    { cx: 820, cy: 120, r: 10, fill: "#ffae00" },
    { cx: 560, cy: 160, r: 10, fill: "#ffdbcf" },
  ];
  const labels = [
    { x: 90, y: 130, text: "PÓRTICO DE LARGADA (06:00)", fill: "#ffffff", size: 16, display: true },
    { x: 430, y: 105, text: "HIDRATAÇÃO 1", fill: "#00daf3", size: 12 },
    { x: 750, y: 60, text: "RETORNO 5KM", fill: "#ffae00", size: 12 },
    { x: 520, y: 195, text: "RETORNO 3KM", fill: "#ffdbcf", size: 12 },
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
            Mapa Esquemático do Circuito
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-primary-container" /> Largada/Chegada
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-tertiary" /> Postos de Hidratação
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto rounded-[1.5rem] bg-surface-container-lowest [scrollbar-width:none]">
        <motion.svg
          viewBox="0 0 900 320"
          fill="none"
          className="h-64 w-full min-w-[680px] sm:h-80 md:min-w-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          role="img"
          aria-label="Mapa esquemático do circuito com largada, hidratação e pontos de retorno"
        >
          {/* Orla / água */}
          <motion.path
            d="M 50,280 C 250,260 450,310 850,240 L 850,320 L 50,320 Z"
            fill="#00363d"
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 0.35, y: 0, transition: { duration: 1.2 } } }}
          />
          <text x="700" y="290" fill="#00daf3" opacity="0.5" fontSize="12" fontWeight="600" className="font-sans">
            ÁGUAS DE BOM JESUS
          </text>

          {/* Pista */}
          <motion.path
            d={ROUTE}
            stroke="#353437"
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 2, ease: "easeInOut" } } }}
          />
          <motion.g
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } } }}
          >
            <path
              d={ROUTE}
              stroke="#ff5708"
              strokeWidth={8}
              strokeDasharray="14 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-dash"
            />
            {/* Corredor percorrendo o circuito */}
            <circle r="9" fill="#ffae00" opacity="0.35">
              <animateMotion dur="10s" repeatCount="indefinite" path={ROUTE} />
            </circle>
            <circle r="5" fill="#ffffff">
              <animateMotion dur="10s" repeatCount="indefinite" path={ROUTE} />
            </circle>
          </motion.g>

          {markers.map((m, i) => (
            <motion.g
              key={i}
              style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                show: { scale: 1, opacity: 1, transition: { delay: 1.8 + i * 0.2, type: "spring", stiffness: 400, damping: 15 } },
              }}
            >
              <circle cx={m.cx} cy={m.cy} r={m.r} fill={m.fill} />
              {m.inner && <circle cx={m.cx} cy={m.cy} r={m.r / 2.4} fill="#ffffff" />}
              {i === 0 && (
                <circle cx={m.cx} cy={m.cy} r={m.r} fill="none" stroke="#ff5708" strokeWidth="2">
                  <animate attributeName="r" values="14;30" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
            </motion.g>
          ))}

          {labels.map((l, i) => (
            <motion.text
              key={l.text}
              x={l.x}
              y={l.y}
              fill={l.fill}
              fontSize={l.size}
              fontWeight={l.display ? 700 : 600}
              className={l.display ? "font-display" : "font-sans"}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { delay: 2 + i * 0.2, duration: 0.5 } },
              }}
            >
              {l.text}
            </motion.text>
          ))}
        </motion.svg>
      </div>
      <p className="flex items-center justify-center gap-1 text-xs text-on-surface-variant md:hidden">
        <MoveHorizontal size={14} /> Arraste para ver o mapa completo
      </p>
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
          eyebrow="Circuitos Oficiais"
          title="Escolha seu Percurso"
          description="Percursos totalmente planos, aferidos e cercados pela brisa marítima, pensados para velocidade e conforto dos corredores."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {courses.map((c, i) => (
            <CourseCard key={c.title} c={c} index={i} />
          ))}
        </div>
        <CircuitMap />
      </div>
    </section>
  );
}
