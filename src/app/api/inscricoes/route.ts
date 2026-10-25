import { createRegistration, UserError } from "@/lib/registrations";
import { parseRegistration } from "@/lib/registration-shared";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Recebe a pré-inscrição do site e coloca na fila. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  }

  // Campo invisível: se vier preenchido, é robô. Não grava nada.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: false, error: "Não foi possível concluir a inscrição." }, { status: 400 });
  }

  const key = String(body.idempotencyKey ?? "");
  if (!UUID.test(key)) {
    return Response.json({ ok: false, error: "Recarregue a página e tente novamente." }, { status: 400 });
  }

  const parsed = parseRegistration(body);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: "Confira os campos destacados.", fieldErrors: parsed.errors }, { status: 422 });
  }

  try {
    const { registration, settings, duplicate } = await createRegistration(parsed.data, key);
    return Response.json({
      ok: true,
      duplicate,
      registration: {
        number: registration.number,
        name: registration.name,
        modality: registration.modality,
        category: registration.category,
        status: registration.status,
      },
      payment: {
        feeCents: settings.feeCents,
        pixKey: settings.pixKey,
        pixHolder: settings.pixHolder,
        whatsapp: settings.whatsapp,
      },
    });
  } catch (err) {
    if (err instanceof UserError) {
      return Response.json({ ok: false, error: err.message, code: err.code }, { status: 409 });
    }
    console.error("[inscricoes] falha ao criar inscrição", err);
    return Response.json(
      { ok: false, error: "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}
