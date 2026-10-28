"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { FileText, ShieldCheck, X } from "lucide-react";
import { LEGAL_UPDATED_AT, PrivacyContent, TermsContent } from "./content";

export type LegalDoc = "termos" | "privacidade";

const DOCS = {
  termos: { title: "Termos de Participação", icon: FileText, Content: TermsContent },
  privacidade: { title: "Política de Privacidade", icon: ShieldCheck, Content: PrivacyContent },
} as const;

const noopSubscribe = () => () => {};

/** Modal com o texto completo dos Termos ou da Política de Privacidade. */
export function LegalDialog({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const latestClose = useRef(onClose);
  useEffect(() => {
    latestClose.current = onClose;
  });

  const open = doc !== null;

  // Esc fecha, foco vai para o botão de fechar e a página atrás não rola
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") latestClose.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  const current = doc ? DOCS[doc] : null;

  return createPortal(
    <AnimatePresence>
      {current && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] border border-white/10 bg-surface-container shadow-2xl sm:max-h-[85dvh] sm:rounded-[1.5rem]"
          >
            <div className="bg-velocity absolute inset-x-0 top-0 h-1" />

            <header className="flex items-center gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-primary-container">
                <current.icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-xl font-semibold uppercase tracking-wide text-white">
                  {current.title}
                </h2>
                <p className="text-xs text-on-surface-variant">Atualizado em {LEGAL_UPDATED_AT}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-5 text-sm leading-relaxed text-on-surface-variant sm:px-6">
              <current.Content />
            </div>

            <footer className="border-t border-white/5 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-primary-container px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-0.5 sm:ml-auto sm:block sm:w-auto"
              >
                Entendi
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Botão com aparência de link que abre o documento no modal. */
export function LegalLink({
  doc,
  className,
  children,
}: {
  doc: LegalDoc;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<LegalDoc | null>(null);
  return (
    <>
      <button type="button" onClick={() => setOpen(doc)} className={className}>
        {children}
      </button>
      <LegalDialog doc={open} onClose={() => setOpen(null)} />
    </>
  );
}
