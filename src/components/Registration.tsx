"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  CircleCheckBig,
  Copy,
  ListOrdered,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ease, fadeUp, popIn, stagger, viewportOnce } from "@/lib/motion";
import { LegalLink } from "./legal/LegalDialog";
import {
  MODALITY_LABEL,
  formatMoney,
  formatPhone,
  padNumber,
  whatsappLink,
  type Category,
  type FieldErrors,
  type Modality,
} from "@/lib/registration-shared";

const fieldCls =
  "w-full rounded-full border bg-surface-container-high px-5 py-3 text-white placeholder:text-on-surface-variant/40 transition-all focus:border-primary-container focus:outline-none focus:ring-4 focus:ring-primary-container/20";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-on-surface-variant";

// A corrida tem um único percurso
const MODALITY: Modality = "3km";

type SuccessData = {
  duplicate: boolean;
  registration: { number: number; name: string; modality: Modality; category: Category };
  payment: { feeCents: number; pixKey: string; pixHolder: string; whatsapp: string };
};

type ChipGroupProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

/** Seletor em formato de pílula (estado selecionado do DESIGN.md). */
function ChipGroup({ name, label, options, value, onChange, error }: ChipGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={`${labelCls} mb-2`}>{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`relative flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                selected
                  ? "border-primary-container bg-primary-container/15"
                  : "border-white/5 bg-surface-container-high hover:bg-surface-bright"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? "border-primary-container" : "border-surface-bright"
                }`}
              >
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="h-1.5 w-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#ffae00]"
                    />
                  )}
                </AnimatePresence>
              </span>
              <span className="min-w-0 break-words text-xs font-bold uppercase leading-tight text-white sm:text-sm">
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <span className="text-xs font-semibold text-primary-container">{error}</span>}
    </fieldset>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Sem permissão de área de transferência: o usuário copia manualmente.
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-velocity px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(255,85,0,0.35)] transition-transform active:scale-95"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copiada!" : "Copiar"}
    </button>
  );
}

function SuccessPanel({ data, onReset }: { data: SuccessData; onReset: () => void }) {
  const { registration: r, payment: p } = data;
  const number = padNumber(r.number);
  const message = `Olá! Segue o comprovante do Pix da inscrição nº ${number} - ${r.name} (${r.modality}) na 1ª Corrida com Bom Jesus dos Navegantes.`;

  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-5 rounded-[1.5rem] bg-surface-container-high p-5 sm:p-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 14 }}
        >
          <CircleCheckBig size={48} className="text-secondary" />
        </motion.span>
        <h4 className="font-display text-2xl font-medium uppercase text-white sm:text-3xl">Pré-inscrição efetuada!</h4>
        <p className="max-w-md text-sm text-on-surface-variant">
          {data.duplicate
            ? "Encontramos uma pré-inscrição sua já registrada. Use os dados abaixo para concluir."
            : "Sua vaga está reservada na fila. Para confirmar, faça o Pix e envie o comprovante."}
        </p>
        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2">
          <ListOrdered size={16} className="text-secondary-container" />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Inscrição nº</span>
          <span className="font-display text-xl font-bold text-white">{number}</span>
        </div>
        <span className="text-xs text-on-surface-variant">
          {r.name} • {MODALITY_LABEL[r.modality]}
        </span>
      </div>

      {/* Passo 1: Pix */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-primary-container/30 bg-surface-container-lowest p-4 sm:p-5">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-container">
          1. Pague {formatMoney(p.feeCents)} via Pix
        </span>
        {p.pixKey ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <span className={labelCls}>Chave Pix</span>
                <p className="break-all font-display text-xl font-semibold text-white sm:text-2xl">{p.pixKey}</p>
                {p.pixHolder && <p className="text-xs text-on-surface-variant">Titular: {p.pixHolder}</p>}
              </div>
              <CopyButton value={p.pixKey} />
            </div>
          </>
        ) : (
          <p className="text-sm text-on-surface-variant">
            A chave Pix ainda não foi divulgada. A organização vai enviá-la pelo WhatsApp.
          </p>
        )}
      </div>

      {/* Passo 2: comprovante */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/5 bg-surface-container-lowest p-4 sm:p-5">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-container">
          2. Envie o comprovante pelo WhatsApp
        </span>
        {p.whatsapp ? (
          <>
            <p className="text-sm text-on-surface-variant">
              Mande o comprovante para <strong className="text-white">{formatPhone(p.whatsapp)}</strong> informando o
              número da sua inscrição.
            </p>
            <a
              href={whatsappLink(p.whatsapp, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3 font-display text-base font-semibold uppercase tracking-[0.08em] text-surface-container-lowest transition-transform hover:-translate-y-0.5 sm:w-auto sm:self-start"
            >
              <MessageCircle size={20} /> Enviar comprovante
            </a>
          </>
        ) : (
          <p className="text-sm text-on-surface-variant">O número de WhatsApp será informado em breve pela organização.</p>
        )}
      </div>

      <p className="text-center text-xs text-on-surface-variant">
        3. A organização confere o pagamento e confirma sua inscrição. Depois, entregue 1kg de alimento no Salão
        Paroquial (seg. a sex., 8h às 18h, até 13/11) e receba o voucher: sem ele não há retirada da medalha no
        dia da corrida.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="self-center rounded-full border border-surface-bright px-5 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface transition-colors hover:border-primary-container"
      >
        Fazer outra inscrição
      </button>
    </motion.div>
  );
}

export function Registration() {
  const [genero, setGenero] = useState<Category>("masculino");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<SuccessData | null>(null);
  // Mesma chave em todas as tentativas do mesmo envio: o servidor não duplica.
  const keyRef = useRef<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    keyRef.current ??= crypto.randomUUID();

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: keyRef.current,
          name: form.get("nome"),
          phone,
          modality: MODALITY,
          category: genero,
          website: form.get("website"),
        }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Não foi possível concluir. Tente novamente.");
        setFieldErrors(data?.fieldErrors ?? {});
        return;
      }
      keyRef.current = null;
      setSuccess(data as SuccessData);
      document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setError("Sem conexão com o servidor. Verifique sua internet e toque em enviar de novo — sua inscrição não será duplicada.");
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  }

  function reset() {
    setSuccess(null);
    setPhone("");
    setError(null);
    keyRef.current = null;
  }

  return (
    <section id="inscricao" className="relative w-full overflow-hidden bg-surface-container-lowest py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, rotate: -20 }}
        whileInView={{ opacity: 0.1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="halftone pointer-events-none absolute right-0 top-0 h-80 w-80 text-secondary-container [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease }}
          className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-white/5 bg-surface-container p-5 shadow-2xl sm:p-10 lg:p-16"
        >
          <span className="bg-velocity absolute inset-x-0 top-0 h-1" />

          {/* Cabeçalho */}
          <motion.div
            variants={stagger(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-col gap-1">
              <motion.span variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-primary-container">
                Inscrição Imediata
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-display text-[32px] font-bold uppercase leading-[38px] tracking-tight text-white md:text-5xl md:leading-[54px]"
              >
                Garanta sua inscrição
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm text-on-surface-variant">
                Lote promocional de lançamento. Vagas rigorosamente limitadas pela capacidade técnica da arena.
              </motion.p>
            </div>
            <motion.div
              variants={popIn}
              whileHover={{ rotate: -3, scale: 1.05 }}
              className="flex min-w-[160px] shrink-0 flex-col items-center justify-center self-start rounded-[1.5rem] bg-surface-container-high p-4 text-center shadow-lg sm:self-auto"
            >
              <span className="text-xs font-bold uppercase text-secondary">Taxa Única</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-on-surface-variant">R$</span>
                <span className="font-display text-5xl font-bold leading-none text-white">10</span>
                <span className="font-display text-xl text-white">,00</span>
              </div>
              <span className="text-xs font-bold uppercase text-secondary-container">+ 1kg Alimento</span>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                onSubmit={handleSubmit}
                variants={stagger(0.08, 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col gap-4"
              >
                {/* Armadilha para robôs: invisível para pessoas */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nome" className={labelCls}>Nome Completo do Atleta</label>
                    <input
                      id="nome"
                      name="nome"
                      required
                      minLength={3}
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Ex: Carlos Silva de Oliveira"
                      aria-invalid={!!fieldErrors.name}
                      className={`${fieldCls} ${fieldErrors.name ? "border-primary-container" : "border-transparent"}`}
                    />
                    {fieldErrors.name && <span className="text-xs font-semibold text-primary-container">{fieldErrors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="telefone" className={labelCls}>Telefone Celular / WhatsApp</label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="(00) 90000-0000"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      pattern="\(\d{2}\) \d{4,5}-\d{4}"
                      title="Informe um telefone com DDD"
                      aria-invalid={!!fieldErrors.phone}
                      className={`${fieldCls} ${fieldErrors.phone ? "border-primary-container" : "border-transparent"}`}
                    />
                    {fieldErrors.phone && <span className="text-xs font-semibold text-primary-container">{fieldErrors.phone}</span>}
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
                  {/* Percurso único: aparece já selecionado */}
                  <ChipGroup
                    name="modalidade"
                    label="Percurso"
                    value={MODALITY}
                    onChange={() => {}}
                    error={fieldErrors.modality}
                    options={[{ value: MODALITY, label: MODALITY_LABEL[MODALITY] }]}
                  />
                  <ChipGroup
                    name="genero"
                    label="Categoria"
                    value={genero}
                    onChange={(v) => setGenero(v as Category)}
                    error={fieldErrors.category}
                    options={[
                      { value: "masculino", label: "Masculino" },
                      { value: "feminino", label: "Feminino" },
                    ]}
                  />
                </motion.div>

                <motion.div variants={fadeUp} className="pt-1">
                  <label className="flex cursor-pointer items-center gap-3 rounded-[1.5rem] bg-surface-container-high/60 p-3">
                    <input type="checkbox" required defaultChecked className="h-5 w-5 shrink-0 accent-primary-container" />
                    <span className="text-sm leading-snug text-on-surface-variant">
                      Estou ciente de que, após a confirmação do Pix, devo entregar{" "}
                      <strong className="text-white">1kg de alimento não-perecível</strong> no Salão Paroquial (seg. a sex.,
                      8h às 18h, até 13/11), onde recebo o <strong className="text-white">voucher</strong> que devo
                      apresentar no dia da corrida para receber a medalha.
                    </span>
                  </label>
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-[1.5rem] bg-surface-container-high/60 p-3">
                    <input type="checkbox" required className="h-5 w-5 shrink-0 accent-primary-container" />
                    <span className="text-sm leading-snug text-on-surface-variant">
                      Li e aceito os{" "}
                      <LegalLink doc="termos" className="font-semibold text-white underline underline-offset-2 hover:text-primary">
                        Termos de Participação
                      </LegalLink>{" "}
                      e a{" "}
                      <LegalLink doc="privacidade" className="font-semibold text-white underline underline-offset-2 hover:text-primary">
                        Política de Privacidade
                      </LegalLink>
                      .
                    </span>
                  </label>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="flex items-start gap-2 overflow-hidden rounded-[1.5rem] border border-primary-container/40 bg-primary-container/10 p-3 text-sm text-white"
                    >
                      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-primary-container" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={fadeUp} className="flex flex-col gap-2 pt-4">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={submitting ? undefined : { y: -3 }}
                    whileTap={submitting ? undefined : { scale: 0.98 }}
                    className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-secondary px-4 py-4 font-display text-base font-bold uppercase tracking-[0.08em] text-surface-container-lowest shadow-[0_10px_30px_rgba(255,87,8,0.5)] transition-shadow hover:shadow-[0_14px_40px_rgba(255,174,0,0.7)] disabled:cursor-wait disabled:opacity-80"
                  >
                    {!submitting && <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40" />}
                    {submitting ? (
                      <Loader2 size={20} className="shrink-0 animate-spin" />
                    ) : (
                      <Zap size={20} className="shrink-0 transition-transform group-hover:scale-125" />
                    )}
                    {submitting ? "Registrando sua inscrição..." : "Finalizar Pré-Inscrição • R$ 10,00 via PIX"}
                  </motion.button>
                  <div className="flex flex-col items-center justify-center gap-2 pt-1 text-center text-xs font-semibold text-on-surface-variant sm:flex-row sm:gap-4">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={16} className="text-secondary" /> Vaga reservada na hora, por ordem de chegada
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} className="text-primary-container" /> Confirmação após o envio do comprovante
                    </span>
                  </div>
                </motion.div>
              </motion.form>
            ) : (
              <SuccessPanel data={success} onReset={reset} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
