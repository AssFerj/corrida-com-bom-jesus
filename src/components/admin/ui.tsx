import { STATUS_LABEL, type Status } from "@/lib/registration-shared";

export const cardCls = "rounded-[1.5rem] border border-white/5 bg-surface-container p-4 shadow-lg sm:p-6";
export const fieldCls =
  "w-full rounded-full border border-transparent bg-surface-container-high px-5 py-3 text-white placeholder:text-on-surface-variant/40 transition-all focus:border-primary-container focus:outline-none focus:ring-4 focus:ring-primary-container/20";
export const labelCls = "text-xs font-semibold uppercase tracking-wider text-on-surface-variant";
export const btnPrimary =
  "bg-velocity inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_6px_20px_rgba(255,85,0,0.35)] transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-surface-bright bg-surface-container-high px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface transition-colors hover:border-primary-container hover:bg-surface-bright disabled:cursor-wait disabled:opacity-60";

const statusCls: Record<Status, string> = {
  pendente: "bg-secondary-container/15 text-secondary-container border-secondary-container/30",
  confirmada: "bg-tertiary/15 text-tertiary border-tertiary/30",
  cancelada: "bg-surface-bright/40 text-on-surface-variant border-white/10 line-through",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusCls[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-container">
          <span className="h-0.5 w-6 bg-current" />
          {eyebrow}
        </span>
        <h1 className="font-display text-[28px] font-bold uppercase leading-9 tracking-wide text-white md:text-4xl">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[1.5rem] bg-surface-container ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Carregando">
      <Skeleton className="h-16 w-64" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
