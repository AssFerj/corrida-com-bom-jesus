"use client";

import { useState, useTransition } from "react";
import { Loader2, PackageCheck, PackageOpen } from "lucide-react";
import { kitAction } from "@/app/admin/actions";

export function KitToggle({ id, version, delivered, enabled }: { id: number; version: number; delivered: boolean; enabled: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending || (!enabled && !delivered)}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await kitAction(id, version, !delivered);
            if (!res?.ok) setError(res?.message ?? "Não foi possível alterar.");
          })
        }
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          delivered
            ? "border border-tertiary/40 bg-tertiary/15 text-tertiary hover:bg-tertiary/25"
            : "bg-velocity text-white shadow-[0_6px_20px_rgba(255,85,0,0.35)] hover:brightness-110"
        }`}
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : delivered ? <PackageCheck size={16} /> : <PackageOpen size={16} />}
        {delivered ? "Kit entregue • desfazer" : "Marcar kit como entregue"}
      </button>
      {!enabled && !delivered && (
        <span className="text-xs text-on-surface-variant">Disponível depois que o pagamento for confirmado.</span>
      )}
      {error && <span role="alert" className="text-xs font-semibold text-primary-container">{error}</span>}
    </div>
  );
}
