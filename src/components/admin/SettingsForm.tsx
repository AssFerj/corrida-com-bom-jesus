"use client";

import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettingsAction } from "@/app/admin/actions";
import { formatPhone } from "@/lib/registration-shared";
import { btnPrimary, cardCls, fieldCls, labelCls } from "./ui";

type Props = {
  pixKey: string;
  pixHolder: string;
  whatsapp: string;
  feeCents: number;
  maxRegistrations: number | null;
  registrationsOpen: boolean;
};

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelCls}>{label}</label>
      {children}
      {error ? (
        <span className="text-xs font-semibold text-primary-container">{error}</span>
      ) : (
        hint && <span className="text-xs text-on-surface-variant">{hint}</span>
      )}
    </div>
  );
}

export function SettingsForm(props: Props) {
  const [state, action, pending] = useActionState(saveSettingsAction, null);
  const [whatsapp, setWhatsapp] = useState(formatPhone(props.whatsapp));
  const [open, setOpen] = useState(props.registrationsOpen);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      <section className={`${cardCls} flex flex-col gap-4`}>
        <div>
          <h2 className="font-display text-xl font-medium uppercase text-white">Pagamento via Pix</h2>
          <p className="text-sm text-on-surface-variant">Aparece para o atleta logo depois que ele envia a pré-inscrição.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="pixKey" label="Chave Pix" hint="CPF, CNPJ, e-mail, telefone ou chave aleatória." error={err.pixKey}>
            <input id="pixKey" name="pixKey" defaultValue={props.pixKey} maxLength={140} placeholder="Ex: contato@paroquia.com.br" className={fieldCls} />
          </Field>
          <Field id="pixHolder" label="Nome do titular" hint="Ajuda o atleta a conferir antes de pagar." error={err.pixHolder}>
            <input id="pixHolder" name="pixHolder" defaultValue={props.pixHolder} maxLength={120} placeholder="Ex: Paróquia Bom Jesus dos Navegantes" className={fieldCls} />
          </Field>
          <Field id="fee" label="Valor da inscrição (R$)" error={err.fee}>
            <input
              id="fee"
              name="fee"
              inputMode="decimal"
              defaultValue={(props.feeCents / 100).toFixed(2).replace(".", ",")}
              className={fieldCls}
            />
          </Field>
        </div>
      </section>

      <section className={`${cardCls} flex flex-col gap-4`}>
        <div>
          <h2 className="font-display text-xl font-medium uppercase text-white">Comprovantes</h2>
          <p className="text-sm text-on-surface-variant">O atleta recebe um botão para enviar o comprovante para este WhatsApp.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="whatsapp" label="WhatsApp da organização" hint="Com DDD. Ex: (88) 99999-0000" error={err.whatsapp}>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              placeholder="(00) 90000-0000"
              className={fieldCls}
            />
          </Field>
        </div>
      </section>

      <section className={`${cardCls} flex flex-col gap-4`}>
        <div>
          <h2 className="font-display text-xl font-medium uppercase text-white">Vagas</h2>
          <p className="text-sm text-on-surface-variant">
            Inscrições canceladas liberam a vaga. Quando o limite é atingido, o site recusa novas inscrições.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="maxRegistrations" label="Limite de inscrições" hint="Deixe vazio para não limitar." error={err.maxRegistrations}>
            <input
              id="maxRegistrations"
              name="maxRegistrations"
              type="number"
              min={1}
              step={1}
              defaultValue={props.maxRegistrations ?? ""}
              placeholder="Sem limite"
              className={fieldCls}
            />
          </Field>
          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>Inscrições no site</span>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-full bg-surface-container-high px-5 py-3">
              <span className={`text-sm font-semibold ${open ? "text-tertiary" : "text-on-surface-variant"}`}>
                {open ? "Abertas" : "Fechadas"}
              </span>
              <input
                type="checkbox"
                name="registrationsOpen"
                checked={open}
                onChange={(e) => setOpen(e.target.checked)}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 rounded-full bg-surface-bright transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-primary-container peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-primary-container/30" />
            </label>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={pending} className={`${btnPrimary} py-3`}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar configurações
        </button>
        {state?.message && (
          <span role="status" className={`text-sm font-semibold ${state.ok ? "text-tertiary" : "text-primary-container"}`}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
