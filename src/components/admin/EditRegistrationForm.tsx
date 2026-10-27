"use client";

import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateRegistrationAction } from "@/app/admin/actions";
import { formatPhone, type Category, type Modality } from "@/lib/registration-shared";
import { btnPrimary, fieldCls, labelCls } from "./ui";

type Props = {
  id: number;
  version: number;
  name: string;
  phone: string;
  modality: Modality;
  category: Category;
  notes: string;
};

export function EditRegistrationForm(props: Props) {
  const [state, action, pending] = useActionState(updateRegistrationAction, null);
  const [phone, setPhone] = useState(formatPhone(props.phone));
  const err = state?.fieldErrors ?? {};

  return (
    // A versão vem sempre atualizada do servidor; se outra pessoa salvar antes, o servidor recusa.
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={props.id} />
      <input type="hidden" name="version" value={props.version} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelCls}>Nome completo</label>
          <input id="name" name="name" required defaultValue={props.name} className={fieldCls} />
          {err.name && <span className="text-xs font-semibold text-primary-container">{err.name}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelCls}>Telefone / WhatsApp</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className={fieldCls}
          />
          {err.phone && <span className="text-xs font-semibold text-primary-container">{err.phone}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="modality" className={labelCls}>Percurso</label>
          <select id="modality" name="modality" defaultValue="3km" className={`${fieldCls} cursor-pointer`}>
            <option value="3km">3 km Caminhada / Corrida</option>
          </select>
          {props.modality !== "3km" && (
            <span className="text-xs font-semibold text-secondary-container">
              Inscrição antiga em {props.modality}: ao salvar, passa para 3 km.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className={labelCls}>Categoria</label>
          <select id="category" name="category" defaultValue={props.category} className={`${fieldCls} cursor-pointer`}>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className={labelCls}>Observações internas</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          defaultValue={props.notes}
          placeholder="Ex: comprovante recebido às 14h, pagou em nome de outra pessoa..."
          className={`${fieldCls} rounded-[1.5rem] resize-y`}
        />
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar alterações
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
