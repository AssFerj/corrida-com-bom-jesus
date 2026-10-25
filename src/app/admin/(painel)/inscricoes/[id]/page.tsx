import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History, MessageCircle } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getRegistration, getSettings, type RegistrationEvent } from "@/lib/registrations";
import {
  CATEGORY_LABEL,
  MODALITY_LABEL,
  STATUS_LABEL,
  formatDateTime,
  formatMoney,
  formatPhone,
  padNumber,
  whatsappLink,
  type Status,
} from "@/lib/registration-shared";
import { StatusActions } from "@/components/admin/StatusActions";
import { EditRegistrationForm } from "@/components/admin/EditRegistrationForm";
import { KitToggle } from "@/components/admin/KitToggle";
import { PageSkeleton, StatusBadge, btnGhost, cardCls } from "@/components/admin/ui";

export default function RegistrationPage({ params }: PageProps<"/admin/inscricoes/[id]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Detail params={params} />
    </Suspense>
  );
}

function describe(e: RegistrationEvent) {
  const d = e.detail as Record<string, unknown>;
  switch (e.type) {
    case "criada":
      return "Pré-inscrição recebida pelo site";
    case "status":
      return `Status: ${STATUS_LABEL[d.de as Status] ?? d.de} → ${STATUS_LABEL[d.para as Status] ?? d.para}`;
    case "kit":
      return d.entregue ? "Kit entregue" : "Entrega do kit desfeita";
    case "editada":
      return `Dados alterados: ${Object.keys(d).join(", ")}`;
    default:
      return e.type;
  }
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();

  const [data, settings] = await Promise.all([getRegistration(id), getSettings()]);
  if (!data) notFound();
  const { registration: r, events } = data;
  const number = padNumber(r.number);

  const msgConfirmed = `Olá, ${r.name.split(" ")[0]}! Seu pagamento foi confirmado e sua inscrição nº ${number} (${r.modality}) na 1ª Corrida com Bom Jesus dos Navegantes está garantida. Lembre-se de levar 1kg de alimento na retirada do kit. Até a largada!`;
  const msgPending = `Olá, ${r.name.split(" ")[0]}! Recebemos sua pré-inscrição nº ${number} na 1ª Corrida com Bom Jesus dos Navegantes. Para confirmar, faça o Pix de ${formatMoney(settings.feeCents)}${settings.pixKey ? ` para a chave ${settings.pixKey}` : ""} e envie o comprovante por aqui.`;

  return (
    <>
      <Link href="/admin" className="flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-white">
        <ArrowLeft size={14} /> Voltar para a lista
      </Link>

      <div className={`${cardCls} relative flex flex-col gap-4 overflow-hidden sm:flex-row sm:items-center sm:justify-between`}>
        <span className="bg-velocity absolute inset-x-0 top-0 h-1" />
        <div className="min-w-0">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-primary-container">Inscrição nº {number}</span>
          <h1 className="break-words font-display text-[28px] font-bold uppercase leading-9 text-white md:text-4xl">{r.name}</h1>
          <p className="text-sm text-on-surface-variant">
            {MODALITY_LABEL[r.modality]} • {CATEGORY_LABEL[r.category]} • recebida em {formatDateTime(r.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <StatusBadge status={r.status} />
          <StatusActions id={r.id} version={r.version} status={r.status} name={r.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className={cardCls}>
            <h2 className="mb-4 font-display text-xl font-medium uppercase text-white">Dados do atleta</h2>
            <EditRegistrationForm
              id={r.id}
              version={r.version}
              name={r.name}
              phone={r.phone}
              modality={r.modality}
              category={r.category}
              notes={r.notes}
            />
          </section>

          <section className={cardCls}>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-medium uppercase text-white">
              <History size={20} className="text-primary-container" /> Histórico
            </h2>
            <ol className="relative flex flex-col gap-4 border-l border-surface-container-highest pl-5">
              {events.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-container" />
                  <p className="text-sm text-white">{describe(e)}</p>
                  <p className="text-xs text-on-surface-variant">{formatDateTime(e.createdAt)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className={`${cardCls} flex flex-col gap-3`}>
            <h2 className="font-display text-xl font-medium uppercase text-white">Contato</h2>
            <p className="text-lg font-semibold text-white">{formatPhone(r.phone)}</p>
            <a href={whatsappLink(r.phone)} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              <MessageCircle size={16} className="text-[#25d366]" /> Abrir conversa
            </a>
            <a
              href={whatsappLink(r.phone, r.status === "confirmada" ? msgConfirmed : msgPending)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-surface-container-lowest"
            >
              <MessageCircle size={16} />
              {r.status === "confirmada" ? "Avisar que foi confirmada" : "Reenviar dados do Pix"}
            </a>
          </section>

          <section className={`${cardCls} flex flex-col gap-3`}>
            <h2 className="font-display text-xl font-medium uppercase text-white">Retirada do kit</h2>
            <p className="text-sm text-on-surface-variant">Marque quando o atleta retirar o kit e entregar o 1kg de alimento.</p>
            <KitToggle id={r.id} version={r.version} delivered={r.kitDelivered} enabled={r.status === "confirmada"} />
          </section>

          <section className={`${cardCls} flex flex-col gap-1 text-sm`}>
            <h2 className="mb-2 font-display text-xl font-medium uppercase text-white">Registro</h2>
            <p className="text-on-surface-variant">Criada: <span className="text-white">{formatDateTime(r.createdAt)}</span></p>
            <p className="text-on-surface-variant">Última alteração: <span className="text-white">{formatDateTime(r.updatedAt)}</span></p>
            {r.confirmedAt && (
              <p className="text-on-surface-variant">Confirmada: <span className="text-white">{formatDateTime(r.confirmedAt)}</span></p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
