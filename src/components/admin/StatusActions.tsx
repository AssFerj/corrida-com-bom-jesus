"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, Loader2, RotateCcw, XCircle } from "lucide-react";
import { changeStatusAction } from "@/app/admin/actions";
import type { Status } from "@/lib/registration-shared";

type Props = { id: number; version: number; status: Status; name: string; compact?: boolean };

/** Botões para mudar o status de uma inscrição. */
export function StatusActions({ id, version, status, name, compact }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<Status | null>(null);

  function run(next: Status, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setError(null);
    setTarget(next);
    start(async () => {
      const res = await changeStatusAction(id, version, next);
      if (!res?.ok) setError(res?.message ?? "Não foi possível alterar.");
      setTarget(null);
    });
  }

  const size = compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-xs";
  const base = `inline-flex items-center justify-center gap-1.5 rounded-full font-semibold uppercase tracking-wider transition-all disabled:cursor-wait disabled:opacity-60 ${size}`;
  const icon = (s: Status, el: React.ReactNode) => (pending && target === s ? <Loader2 size={14} className="animate-spin" /> : el);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-2">
        {status === "pendente" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run("confirmada")}
            className={`${base} bg-tertiary text-on-tertiary hover:brightness-110`}
          >
            {icon("confirmada", <BadgeCheck size={14} />)} Confirmar pagamento
          </button>
        )}
        {status === "confirmada" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run("pendente", `Desfazer a confirmação de pagamento de ${name}?`)}
            className={`${base} border border-surface-bright bg-surface-container-high text-on-surface hover:border-secondary-container`}
          >
            {icon("pendente", <RotateCcw size={14} />)} Desfazer confirmação
          </button>
        )}
        {status !== "cancelada" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run("cancelada", `Cancelar a inscrição de ${name}? A vaga será liberada.`)}
            className={`${base} border border-white/10 text-on-surface-variant hover:border-primary-container hover:text-primary-container`}
          >
            {icon("cancelada", <XCircle size={14} />)} Cancelar
          </button>
        )}
        {status === "cancelada" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run("pendente", `Reativar a inscrição de ${name}? Ela volta a ocupar uma vaga.`)}
            className={`${base} border border-surface-bright bg-surface-container-high text-on-surface hover:border-secondary-container`}
          >
            {icon("pendente", <RotateCcw size={14} />)} Reativar
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="max-w-xs text-xs font-semibold text-primary-container">
          {error}
        </p>
      )}
    </div>
  );
}
