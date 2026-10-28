import { connection } from "next/server";
import { MessageCircle } from "lucide-react";
import { LegalLink } from "./legal/LegalDialog";
import { getSettings } from "@/lib/registrations";
import { whatsappLink } from "@/lib/registration-shared";

const linkCls = "text-sm transition-colors hover:text-on-surface";

/** Links do rodapé. Sem WhatsApp cadastrado, o contato aparece sem link. */
export function FooterLegalLinksView({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      <LegalLink doc="termos" className={linkCls}>
        Termos de Participação
      </LegalLink>
      <LegalLink doc="privacidade" className={linkCls}>
        Privacidade
      </LegalLink>
      {whatsapp ? (
        <a
          href={whatsappLink(whatsapp, "Olá! Gostaria de falar com a organização da 1ª Corrida com Bom Jesus dos Navegantes.")}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkCls} inline-flex items-center gap-1.5`}
        >
          <MessageCircle size={15} /> Contato da Organização
        </a>
      ) : (
        <span className="text-sm">Contato da Organização</span>
      )}
    </div>
  );
}

/** Busca no banco o WhatsApp definido no admin (em tempo real). */
export async function FooterLegalLinks() {
  await connection();
  let whatsapp = "";
  try {
    whatsapp = (await getSettings()).whatsapp;
  } catch (err) {
    console.error("[rodapé] não foi possível ler o WhatsApp da organização", err);
  }
  return <FooterLegalLinksView whatsapp={whatsapp} />;
}
