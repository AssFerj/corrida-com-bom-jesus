import * as motion from "motion/react-client";
import { HandHeart, Mail, Radio, Share2 } from "lucide-react";
import { LogoMark } from "./ui";
import { fadeUp, popIn, stagger } from "@/lib/motion";

const quickLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre-o-evento", label: "Sobre o Evento" },
  { href: "#percursos", label: "Percursos 3K/5K" },
  { href: "#inscricao", label: "Inscrições" },
  { href: "#cronograma", label: "Regulamento Oficial" },
  { href: "#percursos", label: "Ponto de Largada" },
];

const partners = ["Prefeitura Municipal", "Federação Atletismo", "Paróquia Matriz", "Guarda Portuária"];

const socials = [
  { icon: Share2, label: "Compartilhar" },
  { icon: Radio, label: "Transmissão" },
  { icon: Mail, label: "E-mail" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-surface-container-lowest py-14 text-on-surface-variant sm:py-16">
      <motion.div
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          <motion.div variants={fadeUp} className="flex flex-col gap-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 shrink-0" />
              <span className="font-display text-2xl font-semibold uppercase tracking-wide text-on-surface">
                Bom Jesus dos Navegantes
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed">
              O maior desafio esportivo, cultural e de fé da região. Superação e fé em um percurso à beira-mar.
            </p>
            <div className="flex items-center gap-4 rounded-2xl bg-surface-container p-4">
              <HandHeart size={28} className="shrink-0 text-secondary-container" />
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-on-surface">Ação Solidária Obrigatória</span>
                <span className="text-sm">Entrega de 1kg de alimento não-perecível na retirada do kit atleta.</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 md:col-span-4">
            <span className="font-display text-xl font-medium uppercase tracking-wider text-on-surface">Navegação Rápida</span>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="group flex items-center gap-1 text-sm transition-colors hover:text-primary"
                >
                  <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 md:col-span-3">
            <span className="font-display text-xl font-medium uppercase tracking-wider text-on-surface">Apoio & Parcerias</span>
            <motion.div variants={stagger(0.08)} className="flex flex-wrap items-center gap-2">
              {partners.map((p) => (
                <motion.div
                  key={p}
                  variants={popIn}
                  className="rounded-2xl bg-surface-container px-4 py-1 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-surface-container-high hover:text-white"
                >
                  {p}
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-2 flex items-center gap-4">
              {socials.map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ y: -4, rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary-container"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="flex w-full flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-center sm:flex-row sm:text-left"
        >
          <span className="text-sm">© 2026 1ª Corrida com Bom Jesus dos Navegantes. Todos os direitos reservados.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Termos de Participação", "Privacidade", "Contato da Organização"].map((t) => (
              <a key={t} href="#" className="text-sm transition-colors hover:text-on-surface">
                {t}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
