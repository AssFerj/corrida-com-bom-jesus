"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "./ui";
import { ease } from "@/lib/motion";

export const navLinks = [
  { id: "inicio", label: "Início" },
  { id: "sobre-o-evento", label: "Sobre o Evento" },
  { id: "percursos", label: "Percursos" },
  { id: "inscricao", label: "Inscrição" },
  { id: "cronograma", label: "Regulamento & Cronograma" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Destaca o link da seção visível
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Trava o scroll com o menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fecha o menu mobile, libera o scroll e só então rola até a seção
  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    }, 0);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-surface/90 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a href="#inicio" className="group flex items-center gap-2" onClick={goTo("inicio")}>
          <motion.span whileHover={{ rotate: -12, scale: 1.08 }} className="inline-flex">
            <LogoMark />
          </motion.span>
          <span className="font-display text-lg font-medium uppercase tracking-wider text-on-surface sm:text-xl">
            1ª Corrida Bom Jesus
          </span>
        </a>

        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.id}
              href={`#${link.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease }}
              className={`relative py-1 text-sm font-medium uppercase tracking-wider transition-colors ${
                active === link.id ? "text-white" : "text-on-surface-variant hover:text-white"
              }`}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="bg-velocity absolute inset-x-0 -bottom-1 h-0.5 rounded-full"
                />
              )}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="#inscricao"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-velocity hidden items-center justify-center rounded-full px-6 py-2 font-display text-base font-semibold uppercase tracking-[0.08em] text-white shadow-[0_6px_20px_rgba(255,85,0,0.45)] transition-shadow hover:shadow-[0_8px_28px_rgba(255,174,0,0.6)] md:inline-flex"
          >
            Inscreva-se Agora
          </motion.a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-white xl:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Barra de progresso do scroll */}
      <motion.div
        style={{ scaleX: progress }}
        className="bg-velocity absolute inset-x-0 bottom-0 h-0.5 origin-left"
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100dvh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden bg-surface/95 backdrop-blur-xl xl:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
              className="flex flex-col gap-2 px-4 pt-6 sm:px-6"
            >
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={goTo(link.id)}
                    className={`flex items-center justify-between border-b border-surface-container-highest py-4 font-display text-2xl font-semibold uppercase tracking-wide ${
                      active === link.id ? "text-primary-container" : "text-white"
                    }`}
                  >
                    {link.label}
                    <span className="text-sm text-on-surface-variant">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="pt-6">
                <a
                  href="#inscricao"
                  onClick={goTo("inscricao")}
                  className="bg-velocity flex w-full items-center justify-center rounded-full py-4 font-display text-lg font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_25px_rgba(255,87,8,0.5)]"
                >
                  Inscreva-se Agora • R$ 10,00
                </a>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
