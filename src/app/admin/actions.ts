"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  changeStatus,
  setKitDelivered,
  updateRegistrationData,
  updateSettings,
  UserError,
} from "@/lib/registrations";
import { STATUSES, onlyDigits, parseRegistration, type Status } from "@/lib/registration-shared";

export type ActionState = { ok: boolean; message?: string; fieldErrors?: Record<string, string> } | null;

/** Converte erros conhecidos em mensagem; o resto vai para o log. */
function fail(err: unknown): ActionState {
  if (err instanceof UserError) return { ok: false, message: err.message };
  console.error("[admin] erro inesperado", err);
  return { ok: false, message: "Algo deu errado ao salvar. Nada foi alterado; tente novamente." };
}

const toInt = (v: FormDataEntryValue | null) => {
  const n = Number(v);
  return Number.isInteger(n) ? n : NaN;
};

/* ------------------------------- Sessão ------------------------------- */

export async function loginAction(_: ActionState, form: FormData): Promise<ActionState> {
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    // Atrasa tentativas erradas para dificultar chute de senha
    await new Promise((r) => setTimeout(r, 800));
    return { ok: false, message: "Senha incorreta." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ----------------------------- Inscrições ----------------------------- */

export async function changeStatusAction(id: number, version: number, status: Status): Promise<ActionState> {
  await requireAdmin();
  if (!STATUSES.includes(status)) return { ok: false, message: "Status inválido." };
  try {
    await changeStatus(id, version, status);
  } catch (err) {
    return fail(err);
  }
  refresh();
  return { ok: true };
}

export async function kitAction(id: number, version: number, delivered: boolean): Promise<ActionState> {
  await requireAdmin();
  try {
    await setKitDelivered(id, version, delivered);
  } catch (err) {
    return fail(err);
  }
  refresh();
  return { ok: true };
}

export async function updateRegistrationAction(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = toInt(form.get("id"));
  const version = toInt(form.get("version"));
  if (Number.isNaN(id) || Number.isNaN(version)) return { ok: false, message: "Dados inválidos." };

  const parsed = parseRegistration({
    name: form.get("name"),
    phone: form.get("phone"),
    modality: form.get("modality"),
    category: form.get("category"),
  });
  if (!parsed.ok) return { ok: false, message: "Confira os campos.", fieldErrors: parsed.errors };

  const notes = String(form.get("notes") ?? "").trim().slice(0, 1000);
  try {
    await updateRegistrationData(id, version, { ...parsed.data, notes });
  } catch (err) {
    return fail(err);
  }
  refresh();
  return { ok: true, message: "Dados salvos." };
}

/* ---------------------------- Configurações --------------------------- */

export async function saveSettingsAction(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const fieldErrors: Record<string, string> = {};

  const pixKey = String(form.get("pixKey") ?? "").trim();
  const pixHolder = String(form.get("pixHolder") ?? "").trim();
  const whatsapp = onlyDigits(String(form.get("whatsapp") ?? ""));
  const feeRaw = String(form.get("fee") ?? "").replace(/\./g, "").replace(",", ".");
  const fee = Number(feeRaw);
  const maxRaw = String(form.get("maxRegistrations") ?? "").trim();
  const maxRegistrations = maxRaw === "" ? null : Number(maxRaw);
  const registrationsOpen = form.get("registrationsOpen") === "on";

  if (pixKey.length > 140) fieldErrors.pixKey = "Chave muito longa.";
  if (pixHolder.length > 120) fieldErrors.pixHolder = "Nome muito longo.";
  if (whatsapp && (whatsapp.length < 10 || whatsapp.length > 13)) fieldErrors.whatsapp = "Informe o número com DDD.";
  if (!Number.isFinite(fee) || fee < 0 || fee > 10_000) fieldErrors.fee = "Valor inválido.";
  if (maxRegistrations !== null && (!Number.isInteger(maxRegistrations) || maxRegistrations < 1)) {
    fieldErrors.maxRegistrations = "Use um número inteiro maior que zero, ou deixe vazio.";
  }
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Confira os campos.", fieldErrors };

  try {
    await updateSettings({
      pixKey,
      pixHolder,
      whatsapp,
      feeCents: Math.round(fee * 100),
      maxRegistrations,
      registrationsOpen,
    });
  } catch (err) {
    return fail(err);
  }
  refresh();
  return { ok: true, message: "Configurações salvas." };
}
