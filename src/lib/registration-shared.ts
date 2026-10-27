// Tipos, rótulos e validação usados tanto no navegador quanto no servidor.

// "5km" continua no tipo só para exibir inscrições antigas; novas inscrições aceitam apenas 3km.
export const MODALITIES = ["3km", "5km"] as const;
export const OPEN_MODALITIES: readonly Modality[] = ["3km"];
export const CATEGORIES = ["masculino", "feminino"] as const;
export const STATUSES = ["pendente", "confirmada", "cancelada"] as const;

export type Modality = (typeof MODALITIES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

export const MODALITY_LABEL: Record<Modality, string> = {
  "3km": "3km Caminhada / Corrida",
  "5km": "5km (modalidade encerrada)",
};
export const CATEGORY_LABEL: Record<Category, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
};
export const STATUS_LABEL: Record<Status, string> = {
  pendente: "Aguardando pagamento",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
};

export type RegistrationInput = {
  name: string;
  phone: string;
  modality: Modality;
  category: Category;
};

export type FieldErrors = Partial<Record<keyof RegistrationInput, string>>;

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Junta espaços repetidos e corta as pontas. */
export const cleanName = (v: string) => v.replace(/\s+/g, " ").trim();

export function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const padNumber = (n: number) => String(n).padStart(4, "0");

/** Data e hora no fuso de Camocim (CE). */
export function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleString("pt-BR", {
    timeZone: "America/Fortaleza",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Link do WhatsApp (wa.me) a partir de um número brasileiro. */
export function whatsappLink(phone: string, text?: string) {
  let d = onlyDigits(phone);
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${d}${q}`;
}

/** Valida e normaliza os dados do formulário. */
export function parseRegistration(
  raw: Record<string, unknown>,
): { ok: true; data: RegistrationInput } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = cleanName(String(raw.name ?? ""));
  const phone = onlyDigits(String(raw.phone ?? ""));
  const modality = String(raw.modality ?? "") as Modality;
  const category = String(raw.category ?? "") as Category;

  if (name.length < 3 || name.length > 120 || !name.includes(" ")) {
    errors.name = "Informe o nome completo do atleta.";
  }
  if (phone.length < 10 || phone.length > 11) errors.phone = "Informe um telefone com DDD.";
  if (!OPEN_MODALITIES.includes(modality)) errors.modality = "A corrida tem apenas o percurso de 3km.";
  if (!CATEGORIES.includes(category)) errors.category = "Escolha a categoria.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, phone, modality, category } };
}
