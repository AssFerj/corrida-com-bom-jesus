// Textos dos Termos de Participação e da Política de Privacidade (LGPD).
// Ao mudar regras do evento, revise estes textos e a data de atualização.

export const LEGAL_UPDATED_AT = "28 de outubro de 2026";

const ORG = "Paróquia Bom Jesus dos Navegantes de Camocim (CE)";

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-display text-base font-semibold uppercase tracking-wide text-white">
        {n}. {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-primary-container">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function TermsContent() {
  return (
    <>
      <p>
        Estes Termos regulam a participação na <strong>1ª Corrida com Bom Jesus dos Navegantes</strong>. Ao concluir a
        inscrição, o participante (ou seu responsável legal) declara que leu, entendeu e aceita todas as condições
        abaixo.
      </p>

      <Section n={1} title="Organização e evento">
        <p>
          O evento é organizado pela {ORG}, por meio de sua comissão organizadora (&quot;Organização&quot;). A prova
          acontece no <strong>domingo, 15 de novembro de 2026</strong>, com largada às <strong>06h00</strong> e
          largada/chegada em frente à Igreja Matriz, em Camocim (CE), em percurso único de <strong>3 km</strong>, que
          pode ser feito correndo ou caminhando. A prova não tem caráter competitivo: não há classificação, cronometragem
          oficial nem premiação.
        </p>
      </Section>

      <Section n={2} title="Inscrição">
        <List
          items={[
            "A inscrição é pessoal, individual e intransferível, feita pelo site com nome completo e telefone com WhatsApp.",
            "O envio do formulário gera uma pré-inscrição com número na fila. Ela só é confirmada depois que a Organização confere o pagamento.",
            "O pagamento é feito por Pix, no valor divulgado no site no momento da inscrição, e o comprovante deve ser enviado pelo WhatsApp da Organização.",
            "Pré-inscrições sem pagamento podem ser canceladas pela Organização para liberar a vaga a outra pessoa.",
            "As vagas são limitadas. A Organização pode encerrar as inscrições quando o limite for atingido ou a qualquer momento antes do evento.",
            "O participante é responsável pela veracidade dos dados informados.",
          ]}
        />
      </Section>

      <Section n={3} title="Ação solidária, voucher e medalha">
        <List
          items={[
            <>
              Após a confirmação do pagamento, o participante deve entregar <strong>1 kg de alimento não-perecível</strong>{" "}
              no Salão Paroquial, de segunda a sexta-feira, das 8h às 18h, até <strong>13 de novembro de 2026</strong>.
            </>,
            <>
              Na entrega do alimento, o participante recebe um <strong>voucher</strong>. A medalha é entregue no dia da
              corrida somente a quem concluir o percurso e <strong>apresentar o voucher</strong>.
            </>,
            "O voucher é pessoal e deve ser guardado até o dia da prova. Em caso de perda, o participante deve procurar a Organização antes do dia da corrida.",
            "Todos os alimentos arrecadados são destinados às famílias assistidas pela Paróquia.",
            "O participante que não entregar o alimento no prazo não recebe o voucher nem a medalha.",
          ]}
        />
      </Section>

      <Section n={4} title="Saúde e segurança">
        <List
          items={[
            "O participante declara estar em boas condições de saúde e apto a realizar atividade física de 3 km. Recomenda-se avaliação médica prévia, principalmente para quem tem condição de saúde pré-existente, é gestante ou não pratica atividade física com regularidade.",
            "Cabe ao participante avaliar seus limites, interromper a prova se sentir qualquer mal-estar e seguir as orientações da equipe de apoio, de saúde e dos agentes de trânsito.",
            "A Organização disponibiliza ponto de hidratação, hidratação e frutas na chegada e apoio de primeiros socorros durante o evento. Em caso de emergência, o participante autoriza o atendimento e a remoção para a rede de saúde mais próxima.",
            "Recomenda-se não levar objetos de valor. A Organização não se responsabiliza por objetos perdidos ou deixados sem guarda, salvo nos casos previstos em lei.",
          ]}
        />
      </Section>

      <Section n={5} title="Menores de idade">
        <p>
          Menores de 18 anos só podem participar com autorização de seus pais ou responsáveis legais, que fazem a
          inscrição, aceitam estes Termos em nome do menor e respondem por ele. Recomenda-se que crianças façam o
          percurso acompanhadas por um adulto responsável.
        </p>
      </Section>

      <Section n={6} title="Conduta">
        <p>
          O participante deve respeitar o percurso definido, os demais participantes, os voluntários e o caráter
          religioso e familiar do evento. A Organização pode retirar da prova, sem direito a medalha ou reembolso, quem
          colocar em risco a própria segurança ou a de terceiros, cortar o percurso, usar o número de outra pessoa ou
          tiver comportamento ofensivo, violento ou discriminatório.
        </p>
      </Section>

      <Section n={7} title="Desistência, cancelamento e adiamento">
        <List
          items={[
            "O participante pode desistir da inscrição em até 7 (sete) dias após o pagamento e receber o valor de volta integralmente, conforme o art. 49 do Código de Defesa do Consumidor. Basta pedir pelo WhatsApp da Organização.",
            "Após esse prazo, o valor pago não é devolvido em caso de desistência ou de não comparecimento, pois é revertido para a realização do evento e para a ação solidária. A inscrição também não pode ser transferida para outra pessoa sem autorização da Organização.",
            "Se o evento for cancelado pela Organização, o valor pago é devolvido. Se precisar ser adiado por motivo de força maior (como condições climáticas, segurança pública ou determinação de autoridades), a inscrição continua válida para a nova data, e quem não puder comparecer pode pedir a devolução.",
            "A Organização pode alterar horários, percurso e programação por motivo de segurança ou de força maior, com aviso pelos canais oficiais.",
          ]}
        />
      </Section>

      <Section n={8} title="Uso de imagem">
        <p>
          O participante autoriza, de forma gratuita, o uso de sua imagem e voz captadas em fotos e vídeos durante o
          evento, para divulgação institucional e pastoral da Paróquia e de futuras edições da corrida (site, redes
          sociais e materiais impressos), sem finalidade comercial. Quem não quiser ser fotografado de forma
          individualizada pode avisar a Organização, e quem quiser a retirada de uma publicação específica pode pedi-la
          a qualquer tempo pelo WhatsApp da Organização.
        </p>
      </Section>

      <Section n={9} title="Dados pessoais">
        <p>
          Os dados informados na inscrição são tratados conforme a <strong>Política de Privacidade</strong> do evento e
          a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
      </Section>

      <Section n={10} title="Disposições gerais">
        <p>
          Os casos omissos são resolvidos pela Organização. Dúvidas e pedidos podem ser enviados pelo WhatsApp da
          Organização (link &quot;Contato da Organização&quot;, no rodapé do site). Fica eleito o foro da Comarca de
          Camocim (CE), sem prejuízo do direito do consumidor de escolher o foro de seu domicílio.
        </p>
      </Section>
    </>
  );
}

export function PrivacyContent() {
  return (
    <>
      <p>
        Esta Política explica como a {ORG} (&quot;Organização&quot;) trata os dados pessoais de quem se inscreve na{" "}
        <strong>1ª Corrida com Bom Jesus dos Navegantes</strong>, em conformidade com a Lei Geral de Proteção de Dados
        Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>

      <Section n={1} title="Quem é o controlador">
        <p>
          A {ORG}, organizadora do evento, é a controladora dos dados pessoais. O contato para qualquer assunto sobre
          seus dados é o WhatsApp da Organização, disponível no link &quot;Contato da Organização&quot;, no rodapé do
          site.
        </p>
      </Section>

      <Section n={2} title="Quais dados coletamos">
        <List
          items={[
            <>
              <strong>Dados da inscrição:</strong> nome completo, telefone/WhatsApp, categoria (masculino ou feminino) e
              percurso.
            </>,
            <>
              <strong>Dados gerados pela inscrição:</strong> número de inscrição, data e hora, situação do pagamento,
              registro da entrega do alimento e do voucher, observações da Organização e o histórico de alterações
              feitas na inscrição.
            </>,
            <>
              <strong>Comprovante de pagamento:</strong> enviado por você pelo WhatsApp, contendo os dados que o seu
              banco incluir nele.
            </>,
            <>
              <strong>Dados técnicos de acesso:</strong> endereço IP, data, hora e informações do navegador podem ficar
              registrados pelo servidor, para segurança e prevenção de abusos.
            </>,
          ]}
        />
        <p>
          Não pedimos CPF, documentos, endereço nem dados de saúde. O site não usa cookies de publicidade nem
          ferramentas de rastreamento; os únicos cookies são os de sessão da área administrativa, usados apenas pela
          equipe da Organização.
        </p>
      </Section>

      <Section n={3} title="Para que usamos os dados e com qual base legal">
        <List
          items={[
            "Registrar e confirmar sua inscrição, controlar a fila de vagas, conferir o pagamento, a entrega do alimento e do voucher e entregar a medalha — execução do contrato de inscrição (art. 7º, V, da LGPD).",
            "Falar com você pelo WhatsApp sobre a sua inscrição, avisos e mudanças do evento — execução do contrato e legítimo interesse (art. 7º, V e IX).",
            "Prevenir fraudes, inscrições duplicadas e abusos no site, e manter a segurança do sistema — legítimo interesse (art. 7º, IX).",
            "Prestar contas da arrecadação e cumprir obrigações legais — cumprimento de obrigação legal e exercício regular de direitos (art. 7º, II e VI).",
          ]}
        />
        <p>Não usamos seus dados para fins comerciais e não os vendemos.</p>
      </Section>

      <Section n={4} title="Com quem compartilhamos">
        <List
          items={[
            "Com a equipe e os voluntários da Organização, apenas no necessário para conduzir o evento.",
            "Com o provedor de hospedagem e banco de dados que mantém o site no ar, que trata os dados apenas sob as instruções da Organização. Esses servidores podem estar localizados fora do Brasil, com garantias adequadas de proteção (art. 33 da LGPD).",
            "Com o WhatsApp (Meta), quando você escolhe conversar com a Organização por esse aplicativo, de acordo com a política de privacidade dele.",
            "Com autoridades públicas, quando houver obrigação legal ou ordem judicial.",
          ]}
        />
      </Section>

      <Section n={5} title="Por quanto tempo guardamos">
        <p>
          Os dados da inscrição ficam guardados enquanto durar o evento e por até <strong>6 (seis) meses</strong> após
          a data da corrida, para atendimento de dúvidas, devoluções e prestação de contas. Depois disso, são excluídos
          ou anonimizados, exceto quando a lei exigir prazo maior ou para defesa em processo administrativo ou judicial.
        </p>
      </Section>

      <Section n={6} title="Como protegemos">
        <p>
          A conexão com o site é criptografada (HTTPS), o acesso à área administrativa é restrito à equipe autorizada e
          protegido por senha e sessão assinada, as consultas ao banco de dados são protegidas contra manipulação, e
          toda alteração em uma inscrição fica registrada. Nenhum sistema é totalmente imune a falhas. Se ocorrer um
          incidente de segurança que possa trazer risco ou dano relevante, comunicaremos os titulares afetados e a
          Autoridade Nacional de Proteção de Dados (ANPD), como determina a lei.
        </p>
      </Section>

      <Section n={7} title="Crianças e adolescentes">
        <p>
          A inscrição de menores de 18 anos deve ser feita pelos pais ou responsáveis legais, que fornecem os dados e
          consentem com o tratamento em nome do menor, sempre no melhor interesse dele (art. 14 da LGPD).
        </p>
      </Section>

      <Section n={8} title="Seus direitos">
        <p>Conforme o art. 18 da LGPD, você pode, a qualquer momento, pedir:</p>
        <List
          items={[
            "confirmação de que tratamos seus dados e acesso a eles;",
            "correção de dados incompletos, inexatos ou desatualizados;",
            "anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;",
            "portabilidade e informação sobre com quem seus dados foram compartilhados;",
            "revisão ou oposição a tratamentos baseados em legítimo interesse.",
          ]}
        />
        <p>
          Os pedidos são feitos pelo WhatsApp da Organização e respondidos em até 15 dias. Para sua segurança, podemos
          confirmar sua identidade antes de atender. A exclusão da inscrição antes do evento impede a participação e a
          entrega da medalha. Você também pode reclamar à ANPD (www.gov.br/anpd).
        </p>
      </Section>

      <Section n={9} title="Alterações desta Política">
        <p>
          Esta Política pode ser atualizada para refletir mudanças no evento ou na lei. A versão vigente fica sempre
          disponível neste site, com a data da última atualização.
        </p>
      </Section>
    </>
  );
}
