import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

function password() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p || p.length < 8) {
    throw new Error("ADMIN_PASSWORD não definida (mínimo de 8 caracteres). Configure-a no .env.local.");
  }
  return p;
}

// Chave de assinatura derivada da senha: trocar a senha derruba todas as sessões.
function secret() {
  return createHash("sha256").update(`corrida-admin-session:${process.env.ADMIN_SESSION_SECRET ?? ""}:${password()}`).digest();
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  return safeEqual(input, password());
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = String(exp);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Valida o cookie de sessão. */
export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  return Number(payload) > Date.now() / 1000;
}

/** Usar no início de toda página e ação do admin. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
