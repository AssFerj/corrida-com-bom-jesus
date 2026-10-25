import "server-only";
import type { PoolClient } from "pg";
import { db, transaction } from "./db";
import {
  STATUSES,
  type Category,
  type Modality,
  type RegistrationInput,
  type Status,
} from "./registration-shared";

export type Settings = {
  pixKey: string;
  pixHolder: string;
  whatsapp: string;
  feeCents: number;
  maxRegistrations: number | null;
  registrationsOpen: boolean;
  updatedAt: Date;
};

export type Registration = {
  id: number;
  number: number;
  name: string;
  phone: string;
  modality: Modality;
  category: Category;
  status: Status;
  kitDelivered: boolean;
  notes: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
};

export type RegistrationEvent = {
  id: number;
  type: string;
  detail: Record<string, unknown>;
  createdAt: Date;
};

/** Erro com mensagem que pode ser mostrada ao usuário. */
export class UserError extends Error {
  constructor(
    message: string,
    public code: "closed" | "full" | "conflict" | "not_found" | "invalid" = "invalid",
  ) {
    super(message);
  }
}

type Row = Record<string, unknown>;

const toSettings = (r: Row): Settings => ({
  pixKey: r.pix_key as string,
  pixHolder: r.pix_holder as string,
  whatsapp: r.whatsapp as string,
  feeCents: r.fee_cents as number,
  maxRegistrations: (r.max_registrations as number | null) ?? null,
  registrationsOpen: r.registrations_open as boolean,
  updatedAt: r.updated_at as Date,
});

const toRegistration = (r: Row): Registration => ({
  id: Number(r.id),
  number: r.number as number,
  name: r.name as string,
  phone: r.phone as string,
  modality: r.modality as Modality,
  category: r.category as Category,
  status: r.status as Status,
  kitDelivered: r.kit_delivered as boolean,
  notes: r.notes as string,
  version: r.version as number,
  createdAt: r.created_at as Date,
  updatedAt: r.updated_at as Date,
  confirmedAt: (r.confirmed_at as Date | null) ?? null,
});

async function logEvent(client: PoolClient, registrationId: number, type: string, detail: object = {}) {
  await client.query(
    "INSERT INTO registration_events (registration_id, type, detail) VALUES ($1, $2, $3)",
    [registrationId, type, JSON.stringify(detail)],
  );
}

/* ----------------------------------------------------------------------------
 * Configurações
 * ------------------------------------------------------------------------- */

export async function getSettings(): Promise<Settings> {
  const { rows } = await db().query("SELECT * FROM settings WHERE id = 1");
  if (!rows[0]) throw new Error("Tabela settings vazia. Rode `npm run db:migrate`.");
  return toSettings(rows[0]);
}

export async function updateSettings(input: Omit<Settings, "updatedAt">): Promise<Settings> {
  const { rows } = await db().query(
    `UPDATE settings
        SET pix_key = $1, pix_holder = $2, whatsapp = $3, fee_cents = $4,
            max_registrations = $5, registrations_open = $6, updated_at = now()
      WHERE id = 1
      RETURNING *`,
    [
      input.pixKey,
      input.pixHolder,
      input.whatsapp,
      input.feeCents,
      input.maxRegistrations,
      input.registrationsOpen,
    ],
  );
  return toSettings(rows[0]);
}

/* ----------------------------------------------------------------------------
 * Fila de inscrições
 * ------------------------------------------------------------------------- */

export type CreateResult = { registration: Registration; settings: Settings; duplicate: boolean };

/**
 * Cria uma inscrição respeitando a fila.
 *
 * - A linha de `settings` é travada (FOR UPDATE): inscrições simultâneas
 *   esperam umas pelas outras e são processadas uma de cada vez.
 * - Dentro da trava, o número é o próximo da sequência e o limite de vagas
 *   é conferido sem risco de duas pessoas pegarem a "última vaga".
 * - `idempotencyKey` vem do navegador: o mesmo envio repetido devolve a
 *   inscrição já criada em vez de criar outra.
 * - Mesmo nome + telefone com inscrição ativa também devolve a existente.
 */
export async function createRegistration(
  input: RegistrationInput,
  idempotencyKey: string,
): Promise<CreateResult> {
  return transaction(async (client) => {
    const { rows: lock } = await client.query("SELECT * FROM settings WHERE id = 1 FOR UPDATE");
    const settings = toSettings(lock[0]);

    // 1. Mesmo envio repetido (clique duplo, rede instável)
    const same = await client.query("SELECT * FROM registrations WHERE idempotency_key = $1", [idempotencyKey]);
    if (same.rows[0]) return { registration: toRegistration(same.rows[0]), settings, duplicate: true };

    // 2. Mesma pessoa já inscrita (não cancelada)
    const existing = await client.query(
      `SELECT * FROM registrations
        WHERE phone = $1 AND lower(name) = lower($2) AND status <> 'cancelada'
        ORDER BY number LIMIT 1`,
      [input.phone, input.name],
    );
    if (existing.rows[0]) return { registration: toRegistration(existing.rows[0]), settings, duplicate: true };

    if (!settings.registrationsOpen) {
      throw new UserError("As inscrições estão encerradas no momento.", "closed");
    }

    if (settings.maxRegistrations !== null) {
      const { rows } = await client.query(
        "SELECT count(*)::int AS total FROM registrations WHERE status <> 'cancelada'",
      );
      if (rows[0].total >= settings.maxRegistrations) {
        throw new UserError("As vagas estão esgotadas.", "full");
      }
    }

    const { rows: next } = await client.query(
      "SELECT COALESCE(MAX(number), 0) + 1 AS next FROM registrations",
    );

    const { rows } = await client.query(
      `INSERT INTO registrations (number, idempotency_key, name, phone, modality, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [next[0].next, idempotencyKey, input.name, input.phone, input.modality, input.category],
    );
    const registration = toRegistration(rows[0]);
    await logEvent(client, registration.id, "criada", {
      modalidade: input.modality,
      categoria: input.category,
    });
    return { registration, settings, duplicate: false };
  });
}

/* ----------------------------------------------------------------------------
 * Consultas do admin
 * ------------------------------------------------------------------------- */

export type ListFilters = {
  q?: string;
  status?: Status | "";
  modality?: Modality | "";
  page?: number;
  pageSize?: number;
};

function buildWhere(f: ListFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (f.status && STATUSES.includes(f.status)) {
    params.push(f.status);
    where.push(`status = $${params.length}`);
  }
  if (f.modality === "3km" || f.modality === "5km") {
    params.push(f.modality);
    where.push(`modality = $${params.length}`);
  }
  const q = f.q?.trim();
  if (q) {
    const digits = q.replace(/\D/g, "");
    const clauses: string[] = [];
    params.push(`%${q}%`);
    clauses.push(`name ILIKE $${params.length}`);
    if (digits) {
      params.push(`%${digits}%`);
      clauses.push(`phone LIKE $${params.length}`);
      if (digits.length <= 6) {
        params.push(Number(digits));
        clauses.push(`number = $${params.length}`);
      }
    }
    where.push(`(${clauses.join(" OR ")})`);
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

export async function listRegistrations(f: ListFilters) {
  const pageSize = f.pageSize ?? 25;
  const page = Math.max(1, f.page ?? 1);
  const { sql, params } = buildWhere(f);
  const [list, count] = await Promise.all([
    db().query(
      `SELECT * FROM registrations ${sql} ORDER BY number ASC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
      params,
    ),
    db().query(`SELECT count(*)::int AS total FROM registrations ${sql}`, params),
  ]);
  const total = count.rows[0].total as number;
  return {
    items: list.rows.map(toRegistration),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listAllRegistrations(f: ListFilters = {}) {
  const { sql, params } = buildWhere(f);
  const { rows } = await db().query(`SELECT * FROM registrations ${sql} ORDER BY number ASC`, params);
  return rows.map(toRegistration);
}

export async function getStats() {
  const { rows } = await db().query(`
    SELECT
      count(*)::int                                                   AS total,
      count(*) FILTER (WHERE status = 'pendente')::int                AS pendentes,
      count(*) FILTER (WHERE status = 'confirmada')::int              AS confirmadas,
      count(*) FILTER (WHERE status = 'cancelada')::int               AS canceladas,
      count(*) FILTER (WHERE status <> 'cancelada' AND modality = '3km')::int AS km3,
      count(*) FILTER (WHERE status <> 'cancelada' AND modality = '5km')::int AS km5,
      count(*) FILTER (WHERE status = 'confirmada' AND kit_delivered)::int    AS kits
    FROM registrations`);
  return rows[0] as {
    total: number;
    pendentes: number;
    confirmadas: number;
    canceladas: number;
    km3: number;
    km5: number;
    kits: number;
  };
}

export async function getRegistration(id: number) {
  const [reg, events] = await Promise.all([
    db().query("SELECT * FROM registrations WHERE id = $1", [id]),
    db().query(
      "SELECT id, type, detail, created_at FROM registration_events WHERE registration_id = $1 ORDER BY created_at DESC, id DESC",
      [id],
    ),
  ]);
  if (!reg.rows[0]) return null;
  return {
    registration: toRegistration(reg.rows[0]),
    events: events.rows.map(
      (e): RegistrationEvent => ({
        id: Number(e.id),
        type: e.type,
        detail: e.detail,
        createdAt: e.created_at,
      }),
    ),
  };
}

/* ----------------------------------------------------------------------------
 * Alterações do admin (com controle de versão)
 * ------------------------------------------------------------------------- */

const CONFLICT_MSG =
  "Esta inscrição foi alterada por outra pessoa enquanto você a editava. Recarregue e tente de novo.";

/** Trava a linha e confere se ninguém alterou desde que o admin abriu a tela. */
async function lockForUpdate(client: PoolClient, id: number, expectedVersion: number) {
  const { rows } = await client.query("SELECT * FROM registrations WHERE id = $1 FOR UPDATE", [id]);
  if (!rows[0]) throw new UserError("Inscrição não encontrada.", "not_found");
  const current = toRegistration(rows[0]);
  if (current.version !== expectedVersion) throw new UserError(CONFLICT_MSG, "conflict");
  return current;
}

export async function changeStatus(id: number, expectedVersion: number, status: Status) {
  if (!STATUSES.includes(status)) throw new UserError("Status inválido.");
  return transaction(async (client) => {
    const current = await lockForUpdate(client, id, expectedVersion);
    if (current.status === status) return current;

    if (current.status === "cancelada") {
      // Reativar uma cancelada ocupa vaga de novo: respeita a fila e o limite.
      const { rows: lock } = await client.query("SELECT * FROM settings WHERE id = 1 FOR UPDATE");
      const settings = toSettings(lock[0]);
      if (settings.maxRegistrations !== null) {
        const { rows } = await client.query(
          "SELECT count(*)::int AS total FROM registrations WHERE status <> 'cancelada'",
        );
        if (rows[0].total >= settings.maxRegistrations) {
          throw new UserError("Não há vagas para reativar esta inscrição.", "full");
        }
      }
    }

    const { rows } = await client.query(
      `UPDATE registrations
          SET status = $2,
              confirmed_at = CASE WHEN $2 = 'confirmada' THEN now() ELSE NULL END,
              version = version + 1,
              updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [id, status],
    );
    await logEvent(client, id, "status", { de: current.status, para: status });
    return toRegistration(rows[0]);
  });
}

export async function setKitDelivered(id: number, expectedVersion: number, delivered: boolean) {
  return transaction(async (client) => {
    const current = await lockForUpdate(client, id, expectedVersion);
    if (delivered && current.status !== "confirmada") {
      throw new UserError("Só é possível entregar o kit de inscrições confirmadas.");
    }
    const { rows } = await client.query(
      `UPDATE registrations SET kit_delivered = $2, version = version + 1, updated_at = now()
        WHERE id = $1 RETURNING *`,
      [id, delivered],
    );
    await logEvent(client, id, "kit", { entregue: delivered });
    return toRegistration(rows[0]);
  });
}

export async function updateRegistrationData(
  id: number,
  expectedVersion: number,
  input: RegistrationInput & { notes: string },
) {
  return transaction(async (client) => {
    const current = await lockForUpdate(client, id, expectedVersion);
    const changes: Record<string, { de: unknown; para: unknown }> = {};
    const fields = [
      ["nome", current.name, input.name],
      ["telefone", current.phone, input.phone],
      ["modalidade", current.modality, input.modality],
      ["categoria", current.category, input.category],
      ["observações", current.notes, input.notes],
    ] as const;
    for (const [label, before, after] of fields) {
      if (before !== after) changes[label] = { de: before, para: after };
    }
    if (!Object.keys(changes).length) return current;

    const { rows } = await client.query(
      `UPDATE registrations
          SET name = $2, phone = $3, modality = $4, category = $5, notes = $6,
              version = version + 1, updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [id, input.name, input.phone, input.modality, input.category, input.notes],
    );
    await logEvent(client, id, "editada", changes);
    return toRegistration(rows[0]);
  });
}
