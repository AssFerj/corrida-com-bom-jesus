"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, Loader2, RotateCcw, XCircle } from "lucide-react";
import { changeStatusAction } from "@/app/admin/actions";
import type { Status } from "@/lib/registration-shared";
import { ConfirmDialog } from "./ConfirmDialog";

type Props = { id: number; version: number; status: Status; name: string; compact?: boolean };

type Ask = { next: Status; title: string; message: React.ReactNode; confirmLabel: string; tone: "danger" | "default" };

/** Botões para mudar o status de uma inscrição. */
export function StatusActions({ id, version, status, name, compact }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<Status | null>(null);
  const [ask, setAskState] = useState<Ask | null>(null);
  const [open, setOpen] = useState(false);
  const setAsk = (a: Ask) => {
    setAskState(a);
    setOpen(true);
  };

  function run(next: Status) {
    setError(null);
    setTarget(next);
    start(async () => {
      const res = await changeStatusAction(id, version, next);
      if (!res?.ok) setError(res?.message ?? "Não foi possível alterar.");
      setTarget(null);
      setOpen(false);
    });
  }

  const who = <strong className="text-white">{name}</strong>;
  const askUndo = () =>
    setAsk({
      next: "pendente",
      title: "Desfazer confirmação?",
      message: <>A inscrição de {who} volta para “Aguardando pagamento”.</>,
      confirmLabel: "Desfazer",
      tone: "default",
    });
  const askCancel = () =>
    setAsk({
      next: "cancelada",
      title: "Cancelar inscrição?",
      message: <>A inscrição de {who} será cancelada e a vaga ficará livre para outra pessoa.</>,
      confirmLabel: "Cancelar inscrição",
      tone: "danger",
    });
  const askReactivate = () =>
    setAsk({
      next: "pendente",
      title: "Reativar inscrição?",
      message: <>A inscrição de {who} volta a ocupar uma vaga, aguardando pagamento.</>,
      confirmLabel: "Reativar",
      tone: "default",
    });

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
            onClick={askUndo}
            className={`${base} border border-surface-bright bg-surface-container-high text-on-surface hover:border-secondary-container`}
          >
            {icon("pendente", <RotateCcw size={14} />)} Desfazer confirmação
          </button>
        )}
        {status !== "cancelada" && (
          <button
            type="button"
            disabled={pending}
            onClick={askCancel}
            className={`${base} border border-white/10 text-on-surface-variant hover:border-primary-container hover:text-primary-container`}
          >
            {icon("cancelada", <XCircle size={14} />)} Cancelar
          </button>
        )}
        {status === "cancelada" && (
          <button
            type="button"
            disabled={pending}
            onClick={askReactivate}
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
      <ConfirmDialog
        open={open}
        title={ask?.title ?? ""}
        message={ask?.message}
        confirmLabel={ask?.confirmLabel ?? ""}
        tone={ask?.tone}
        loading={pending}
        onConfirm={() => ask && run(ask.next)}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
