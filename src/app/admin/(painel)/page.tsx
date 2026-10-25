import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight, Download, MessageCircle, Search, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSettings, getStats, listRegistrations, type ListFilters } from "@/lib/registrations";
import {
  CATEGORY_LABEL,
  STATUSES,
  STATUS_LABEL,
  formatDateTime,
  formatMoney,
  formatPhone,
  padNumber,
  whatsappLink,
  type Modality,
  type Status,
} from "@/lib/registration-shared";
import { StatusActions } from "@/components/admin/StatusActions";
import { PageSkeleton, PageTitle, StatusBadge, btnGhost, btnPrimary, cardCls, fieldCls } from "@/components/admin/ui";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default function AdminHomePage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function Dashboard({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const sp = await searchParams;
  const filters: ListFilters = {
    q: one(sp.q),
    status: (STATUSES as readonly string[]).includes(one(sp.status)) ? (one(sp.status) as Status) : "",
    modality: one(sp.modalidade) === "3km" || one(sp.modalidade) === "5km" ? (one(sp.modalidade) as Modality) : "",
    page: Number(one(sp.pagina)) || 1,
  };

  const [settings, stats, list] = await Promise.all([getSettings(), getStats(), listRegistrations(filters)]);
  const active = stats.total - stats.canceladas;

  const query = (patch: Record<string, string | number>) => {
    const p = new URLSearchParams();
    const all = { q: filters.q ?? "", status: filters.status ?? "", modalidade: filters.modality ?? "", pagina: String(filters.page), ...patch };
    for (const [k, v] of Object.entries(all)) if (v !== "" && !(k === "pagina" && String(v) === "1")) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : "";
  };
  const hasFilters = Boolean(filters.q || filters.status || filters.modality);

  const cards = [
    { label: "Inscrições ativas", value: active, hint: settings.maxRegistrations ? `de ${settings.maxRegistrations} vagas` : "sem limite de vagas", cls: "text-white" },
    { label: "Aguardando pagamento", value: stats.pendentes, hint: "conferir comprovantes", cls: "text-secondary-container", href: `/admin${query({ status: "pendente", pagina: 1 })}` },
    { label: "Confirmadas", value: stats.confirmadas, hint: formatMoney(stats.confirmadas * settings.feeCents) + " recebidos", cls: "text-tertiary", href: `/admin${query({ status: "confirmada", pagina: 1 })}` },
    { label: "Canceladas", value: stats.canceladas, hint: "vagas liberadas", cls: "text-on-surface-variant", href: `/admin${query({ status: "cancelada", pagina: 1 })}` },
  ];

  return (
    <>
      <PageTitle eyebrow="Fila de inscrições" title="Inscrições">
        <a href={`/admin/exportar${query({ pagina: 1 })}`} className={btnGhost}>
          <Download size={16} /> Exportar planilha
        </a>
      </PageTitle>

      {(!settings.pixKey || !settings.whatsapp || !settings.registrationsOpen) && (
        <div className="flex flex-col gap-2 rounded-[1.5rem] border border-secondary-container/30 bg-secondary-container/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-secondary-container" />
            <span className="text-white">
              {!settings.registrationsOpen && "As inscrições estão fechadas no site. "}
              {!settings.pixKey && "A chave Pix ainda não foi cadastrada. "}
              {!settings.whatsapp && "O WhatsApp para comprovantes ainda não foi cadastrado."}
            </span>
          </div>
          <Link href="/admin/configuracoes" className={`${btnPrimary} shrink-0`}>
            Configurar
          </Link>
        </div>
      )}

      {/* Números */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => {
          const body = (
            <>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{c.label}</span>
              <span className={`font-display text-4xl font-bold leading-none ${c.cls}`}>{c.value}</span>
              <span className="text-xs text-on-surface-variant">{c.hint}</span>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${cardCls} flex flex-col gap-2 transition-colors hover:bg-surface-container-high`}>
              {body}
            </Link>
          ) : (
            <div key={c.label} className={`${cardCls} flex flex-col gap-2`}>
              {body}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
        <span className="rounded-full bg-surface-container px-3 py-1.5">3 km: <strong className="text-white">{stats.km3}</strong></span>
        <span className="rounded-full bg-surface-container px-3 py-1.5">5 km: <strong className="text-white">{stats.km5}</strong></span>
        <span className="rounded-full bg-surface-container px-3 py-1.5">Kits entregues: <strong className="text-white">{stats.kits}</strong> de {stats.confirmadas}</span>
      </div>

      {/* Filtros (formulário GET: funciona até sem JavaScript) */}
      <form method="get" className={`${cardCls} grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]`}>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Buscar por nome, telefone ou nº"
            className={`${fieldCls} pl-11`}
          />
        </div>
        <select name="status" defaultValue={filters.status} className={`${fieldCls} cursor-pointer md:w-56`} aria-label="Status">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <select name="modalidade" defaultValue={filters.modality} className={`${fieldCls} cursor-pointer md:w-40`} aria-label="Modalidade">
          <option value="">3 km e 5 km</option>
          <option value="3km">3 km</option>
          <option value="5km">5 km</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className={`${btnPrimary} flex-1`}>Filtrar</button>
          {hasFilters && (
            <Link href="/admin" className={btnGhost} aria-label="Limpar filtros">
              <X size={16} />
            </Link>
          )}
        </div>
      </form>

      {/* Lista */}
      <section className="flex flex-col gap-3">
        <p className="text-xs text-on-surface-variant">
          {list.total} {list.total === 1 ? "inscrição encontrada" : "inscrições encontradas"} • ordem de chegada na fila
        </p>

        {list.items.length === 0 ? (
          <div className={`${cardCls} py-12 text-center text-on-surface-variant`}>
            {hasFilters ? "Nenhuma inscrição com esses filtros." : "Ainda não há inscrições."}
          </div>
        ) : (
          <>
            {/* Tabela (telas grandes) */}
            <div className={`${cardCls} hidden overflow-x-auto p-0 sm:p-0 lg:block`}>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nº</th>
                    <th className="px-3 py-3 font-semibold">Atleta</th>
                    <th className="px-3 py-3 font-semibold">Prova</th>
                    <th className="px-3 py-3 font-semibold">Inscrito em</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {list.items.map((r) => (
                    <tr key={r.id} className="align-middle transition-colors hover:bg-surface-container-high/50">
                      <td className="px-5 py-3 font-display text-lg font-bold text-white">{padNumber(r.number)}</td>
                      <td className="px-3 py-3">
                        <Link href={`/admin/inscricoes/${r.id}`} className="font-semibold text-white hover:text-primary">
                          {r.name}
                        </Link>
                        <a
                          href={whatsappLink(r.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant hover:text-[#25d366]"
                        >
                          <MessageCircle size={12} /> {formatPhone(r.phone)}
                        </a>
                      </td>
                      <td className="px-3 py-3 text-on-surface">
                        <span className="font-semibold">{r.modality}</span>
                        <span className="block text-xs text-on-surface-variant">{CATEGORY_LABEL[r.category]}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-on-surface-variant">{formatDateTime(r.createdAt)}</td>
                      <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3">
                        <StatusActions id={r.id} version={r.version} status={r.status} name={r.name} compact />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cartões (celular e tablet) */}
            <ul className="flex flex-col gap-3 lg:hidden">
              {list.items.map((r) => (
                <li key={r.id} className={`${cardCls} flex flex-col gap-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/admin/inscricoes/${r.id}`} className="min-w-0">
                      <span className="font-display text-sm font-bold text-primary-container">Nº {padNumber(r.number)}</span>
                      <span className="block truncate text-base font-semibold text-white">{r.name}</span>
                      <span className="block text-xs text-on-surface-variant">
                        {r.modality} • {CATEGORY_LABEL[r.category]} • {formatDateTime(r.createdAt)}
                      </span>
                    </Link>
                    <StatusBadge status={r.status} />
                  </div>
                  <a
                    href={whatsappLink(r.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-on-surface-variant"
                  >
                    <MessageCircle size={14} className="text-[#25d366]" /> {formatPhone(r.phone)}
                  </a>
                  <StatusActions id={r.id} version={r.version} status={r.status} name={r.name} compact />
                </li>
              ))}
            </ul>
          </>
        )}

        {list.pages > 1 && (
          <nav className="flex items-center justify-between gap-3 pt-2" aria-label="Paginação">
            {list.page > 1 ? (
              <Link href={`/admin${query({ pagina: list.page - 1 })}`} className={btnGhost}>
                <ChevronLeft size={16} /> Anterior
              </Link>
            ) : (
              <span />
            )}
            <span className="text-xs text-on-surface-variant">
              Página {list.page} de {list.pages}
            </span>
            {list.page < list.pages ? (
              <Link href={`/admin${query({ pagina: list.page + 1 })}`} className={btnGhost}>
                Próxima <ChevronRight size={16} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </>
  );
}
