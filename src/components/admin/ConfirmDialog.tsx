"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { btnGhost, btnPrimary } from "./ui";

const noopSubscribe = () => () => {};

type Props = {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** "danger" destaca ações que liberam vaga ou desfazem algo. */
  tone?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Modal de confirmação no estilo do admin (substitui o confirm() do navegador). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Voltar",
  tone = "default",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Guarda a versão atual de onClose/loading sem reiniciar o efeito abaixo
  const latest = useRef({ onClose, loading });
  useEffect(() => {
    latest.current = { onClose, loading };
  });

  // Esc fecha, foco vai para o botão principal e a página atrás não rola
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => confirmRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !latest.current.loading) latest.current.onClose();
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            tabIndex={-1}
            onClick={() => !loading && onClose()}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-container p-6 shadow-2xl"
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${tone === "danger" ? "bg-velocity" : "bg-tertiary"}`} />
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white disabled:opacity-40"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4 pr-6">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  tone === "danger" ? "bg-primary-container/15 text-primary-container" : "bg-tertiary/15 text-tertiary"
                }`}
              >
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 id={titleId} className="font-display text-xl font-semibold uppercase tracking-wide text-white">
                  {title}
                </h2>
                <div id={descId} className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                  {message}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={loading} className={btnGhost}>
                {cancelLabel}
              </button>
              <button ref={confirmRef} type="button" onClick={onConfirm} disabled={loading} className={btnPrimary}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
