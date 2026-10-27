import { isAdmin } from "@/lib/auth";
import { listAllRegistrations } from "@/lib/registrations";
import {
  CATEGORY_LABEL,
  STATUSES,
  STATUS_LABEL,
  formatDateTime,
  formatPhone,
  padNumber,
  type Modality,
  type Status,
} from "@/lib/registration-shared";

// Planilha (CSV com ";" e BOM, abre direto no Excel em português)
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Não autorizado", { status: 401 });

  const sp = new URL(request.url).searchParams;
  const status = sp.get("status") ?? "";
  const modality = sp.get("modalidade") ?? "";
  const rows = await listAllRegistrations({
    q: sp.get("q") ?? "",
    status: (STATUSES as readonly string[]).includes(status) ? (status as Status) : "",
    modality: modality === "3km" || modality === "5km" ? (modality as Modality) : "",
  });

  const cell = (v: string | number) => {
    const s = String(v);
    // Evita que o Excel interprete o conteúdo como fórmula
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const header = ["Nº", "Nome", "Telefone", "Modalidade", "Categoria", "Status", "Alimento entregue", "Inscrito em", "Confirmado em", "Observações"];
  const lines = rows.map((r) =>
    [
      padNumber(r.number),
      r.name,
      formatPhone(r.phone),
      r.modality,
      CATEGORY_LABEL[r.category],
      STATUS_LABEL[r.status],
      r.kitDelivered ? "Sim" : "Não",
      formatDateTime(r.createdAt),
      r.confirmedAt ? formatDateTime(r.confirmedAt) : "",
      r.notes,
    ]
      .map(cell)
      .join(";"),
  );
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "America/Fortaleza" });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscricoes-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
