"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CircleCheckBig, QrCode, ShieldCheck, Zap } from "lucide-react";
import { ease, fadeUp, popIn, stagger, viewportOnce } from "@/lib/motion";

const fieldCls =
  "w-full rounded-full border border-transparent bg-surface-container-high px-5 py-3 text-white placeholder:text-on-surface-variant/40 transition-all focus:border-primary-container focus:outline-none focus:ring-4 focus:ring-primary-container/20";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-on-surface-variant";

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

type ChipGroupProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
};

/** Seletor em formato de pílula (estado selecionado do DESIGN.md). */
function ChipGroup({ name, label, options, value, onChange }: ChipGroupProps) {
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
              <span className="min-w-0 break-words text-xs font-bold uppercase leading-tight text-white sm:text-sm">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Registration() {
  const [modalidade, setModalidade] = useState("3km");
  const [genero, setGenero] = useState("masculino");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

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
            {!done ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                variants={stagger(0.08, 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="flex flex-col gap-4"
              >
                <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nome" className={labelCls}>Nome Completo do Atleta</label>
                    <input id="nome" name="nome" required autoComplete="name" placeholder="Ex: Carlos Silva de Oliveira" className={fieldCls} />
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
                      className={fieldCls}
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
                  <ChipGroup
                    name="modalidade"
                    label="Modalidade Desejada"
                    value={modalidade}
                    onChange={setModalidade}
                    options={[
                      { value: "3km", label: "3km Caminhada / Corrida" },
                      { value: "5km", label: "5km Corrida Oficial" },
                    ]}
                  />
                  <ChipGroup
                    name="genero"
                    label="Categoria de Premiação"
                    value={genero}
                    onChange={setGenero}
                    options={[
                      { value: "masculino", label: "Masculino" },
                      { value: "feminino", label: "Feminino" },
                    ]}
                  />
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="camiseta" className={labelCls}>Tamanho da Camiseta Dry-Fit</label>
                    <div className="relative">
                      <select id="camiseta" name="camiseta" defaultValue="M" className={`${fieldCls} cursor-pointer appearance-none pr-12`}>
                        <option value="P">Tamanho P (Unissex)</option>
                        <option value="M">Tamanho M (Unissex)</option>
                        <option value="G">Tamanho G (Unissex)</option>
                        <option value="GG">Tamanho GG (Unissex)</option>
                        <option value="BL-M">Baby Look M (Feminina)</option>
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-secondary-container" />
                    </div>
                  </div>
                  <label className="mt-auto flex cursor-pointer items-center gap-3 rounded-[1.5rem] bg-surface-container-high/60 p-3">
                    <input type="checkbox" required defaultChecked className="h-5 w-5 shrink-0 accent-primary-container" />
                    <span className="text-sm leading-snug text-on-surface-variant">
                      Estou ciente de que devo levar <strong className="text-white">1kg de alimento não-perecível</strong> na
                      retirada do kit no dia 14/11.
                    </span>
                  </label>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col gap-2 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-secondary px-4 py-4 font-display text-base font-bold uppercase tracking-[0.08em] text-surface-container-lowest shadow-[0_10px_30px_rgba(255,87,8,0.5)] transition-shadow hover:shadow-[0_14px_40px_rgba(255,174,0,0.7)]"
                  >
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40" />
                    <Zap size={20} className="shrink-0 transition-transform group-hover:scale-125" />
                    Finalizar Inscrição • Pagar R$ 10,00 via PIX
                  </motion.button>
                  <div className="flex flex-col items-center justify-center gap-2 pt-1 text-xs font-semibold text-on-surface-variant sm:flex-row sm:gap-4">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={16} className="text-secondary" /> Pagamento 100% Criptografado
                    </span>
                    <span className="flex items-center gap-1">
                      <QrCode size={16} className="text-primary-container" /> PIX com Confirmação Instantânea
                    </span>
                  </div>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-col items-center gap-2 rounded-[1.5rem] bg-surface-container-high p-8 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 14 }}
                >
                  <CircleCheckBig size={48} className="text-secondary" />
                </motion.span>
                <h4 className="mt-1 font-display text-2xl font-medium uppercase text-white">Pré-Inscrição Registrada!</h4>
                <p className="max-w-md text-sm text-on-surface-variant">
                  Enviamos o código PIX copia-e-cola e as instruções para o seu WhatsApp cadastrado. Te vemos na
                  largada!
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-3 rounded-full border border-surface-bright px-5 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface transition-colors hover:border-primary-container"
                >
                  Nova inscrição
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
