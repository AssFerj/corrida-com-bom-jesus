<div align="center">

<img src="src/app/icon.svg" width="88" alt="Logo da Corrida com Bom Jesus" />

# 1ª Corrida com Bom Jesus dos Navegantes

**Site oficial e sistema de inscrições da corrida de rua de Camocim‑CE — 15/11/2026**

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169e1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker&logoColor=white)

</div>

---

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Fila de inscrições e integridade dos dados](#fila-de-inscrições-e-integridade-dos-dados)
- [Segurança](#segurança)
- [Desempenho](#desempenho)
- [Acessibilidade e experiência](#acessibilidade-e-experiência)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Deploy](#deploy)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Próximos passos](#próximos-passos)

---

## Visão geral

Landing page moderna e responsiva para divulgar a corrida (percurso de 3 km, medalha, programação e
patrocinadores) com **pré‑inscrição online**. O atleta preenche o formulário, recebe na hora o número
da inscrição, a **chave Pix** e um botão para enviar o **comprovante pelo WhatsApp**. A organização
confere o pagamento e confirma a inscrição em um **painel administrativo** próprio.

O pagamento é feito por Pix direto na conta da organização, sem gateway nem integração bancária.

## Funcionalidades

### Site público
- Hero com contagem regressiva, destaques, percursos com **mapa real do traçado** no centro de Camocim,
  medalha para todos que concluírem, hidratação + frutas na chegada, programação e patrocinadores.
- Animações de entrada em todas as seções (Motion), com respeito à preferência de **movimento reduzido**.
- Formulário de pré‑inscrição com validação em tempo real e máscara de telefone.
- Tela de sucesso com número da inscrição, chave Pix com botão **copiar** e botão de **WhatsApp**
  com mensagem pronta (número + nome do atleta).

### Painel administrativo (`/admin`)
- Login com senha única da organização.
- Totais em tempo real: ativas, aguardando pagamento, confirmadas (com valor arrecadado), canceladas,
  e alimentos entregues.
- Busca por nome, telefone ou número; filtro por status; paginação.
- Ações: **confirmar pagamento**, desfazer, **cancelar** (libera a vaga), reativar — sempre com modal
  de confirmação.
- Ficha do atleta: edição de dados, observações internas, controle de **entrega do 1kg de alimento**,
  atalhos de WhatsApp e **histórico completo** de alterações.
- Configurações: chave Pix, titular, WhatsApp, valor da inscrição, **limite de vagas** e
  abrir/fechar inscrições.
- **Exportação para planilha** (CSV compatível com Excel em português), respeitando os filtros.
- Totalmente responsivo: tabela no desktop, cartões no celular.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, Server Actions, Cache Components / PPR) |
| UI | **React 19**, **Tailwind CSS 4**, Motion, Lucide |
| Linguagem | TypeScript (strict) |
| Banco de dados | **PostgreSQL** via `pg` (SQL puro, sem ORM) |
| Infra | Docker (build `standalone`), Dokploy + Traefik com HTTPS |

## Arquitetura

```mermaid
flowchart LR
  A[Atleta no site] -->|POST /api/inscricoes| B[Route Handler]
  B --> C{Validação<br/>honeypot + UUID + campos}
  C -->|ok| D[(PostgreSQL<br/>transação + lock)]
  D --> E[Nº da inscrição + Pix + WhatsApp]
  E --> A
  F[Organização] -->|/admin| G[Server Components]
  G -->|Server Actions| D
```

- **Server Components** renderizam o painel direto do banco, sem API intermediária nem dados sensíveis
  no bundle do navegador.
- **Server Actions** executam as mutações do admin; cada uma valida a sessão antes de qualquer acesso.
- Módulos de servidor (`db`, `auth`, `registrations`) importam `server-only`, o que impede o build de
  incluí‑los por engano em código de cliente.

## Fila de inscrições e integridade dos dados

O requisito central era: **nenhuma inscrição pode se perder ou se misturar**, mesmo com muitos envios
simultâneos. A solução combina:

| Técnica | O que garante |
|---|---|
| **Transação + `SELECT … FOR UPDATE`** na linha de configurações | As inscrições entram em **fila real** no banco: uma de cada vez, na ordem de chegada. |
| **Numeração sequencial** dentro da mesma transação | Números 1, 2, 3… sem repetição e sem buracos. |
| **Chave de idempotência** (UUID gerado no navegador, coluna `UNIQUE`) | Clique duplo, reenvio por rede instável ou retry do navegador **nunca** criam duas inscrições — o mesmo envio devolve a mesma inscrição. |
| **Detecção de duplicidade** por nome + telefone | Quem recarrega a página e envia de novo recebe a inscrição já existente. |
| **Limite de vagas checado sob o lock** | Com 30 pessoas disputando as 5 últimas vagas, **exatamente 5** entram. |
| **Controle de concorrência otimista** (coluna `version`) | Dois administradores alterando a mesma inscrição: a primeira alteração vale e a segunda recebe aviso de conflito, em vez de sobrescrever silenciosamente. |
| **Trilha de auditoria** (`registration_events`, FK `ON DELETE RESTRICT`) | Todo evento — criação, mudança de status, edição, entrega do alimento — fica registrado com data e detalhes. |
| **Restrições no banco** (`CHECK`, `UNIQUE`, `NOT NULL`) | Mesmo que o código falhe, o banco recusa dados inválidos. |

Esses cenários foram validados com testes de carga concorrente contra um PostgreSQL real
(80 inscrições simultâneas, 25 reenvios idênticos, disputa por vagas, edições concorrentes e
10 cliques simultâneos em “confirmar”).

## Segurança

### Autenticação do admin
- Sessão em **cookie assinado com HMAC‑SHA256**, contendo apenas a data de expiração (12 h).
- Chave de assinatura **derivada da senha** (+ segredo opcional): trocar a `ADMIN_PASSWORD`
  invalida todas as sessões abertas.
- Cookie `HttpOnly`, `SameSite=Lax` e `Secure` automaticamente quando acessado via HTTPS
  (detectado por `x-forwarded-proto` atrás do proxy).
- Comparações de senha e assinatura em **tempo constante** (`timingSafeEqual` sobre hashes), evitando
  ataques de temporização.
- **Atraso proposital** após senha incorreta, dificultando tentativas em massa.
- Validade da sessão calculada **no momento da requisição**, nunca em conteúdo pré‑renderizado.
- Toda página, Server Action e rota de exportação do admin verifica a sessão no servidor.

### Entrada de dados
- Validação no cliente **e** no servidor (o servidor é a fonte da verdade).
- **Consultas 100% parametrizadas** — sem concatenação de valores do usuário em SQL.
- Campo **honeypot** invisível para barrar robôs de spam sem CAPTCHA.
- Chave de idempotência validada como UUID.
- Exportação CSV protegida contra **injeção de fórmulas** (CSV/Formula Injection) ao abrir no Excel.

### Infraestrutura e privacidade
- Segredos apenas em variáveis de ambiente; `.env*` fora do Git e da imagem Docker (`.dockerignore`).
- Container roda com **usuário sem privilégios** (`nextjs`, UID 1001).
- Área administrativa marcada com `noindex` para não aparecer em buscadores.
- Mensagens de erro genéricas para o público; detalhes ficam apenas no log do servidor.
- Banco acessado pela **rede interna** do Dokploy em produção, sem porta exposta.

## Desempenho

### Renderização
- **Cache Components / Partial Prerendering**: a landing page é **100% estática**; no admin, o “casco”
  (navegação, layout) é pré‑renderizado e só os dados são transmitidos via streaming.
- **Server Components** por padrão — JavaScript no navegador só onde há interação.
- `Suspense` com **skeletons** para a interface aparecer imediatamente enquanto os dados chegam.
- Após cada ação no admin, apenas os dados afetados são atualizados (`refresh()`), sem recarregar a página.

### Assets
- Fontes via `next/font` (Oswald e Space Grotesk): auto‑hospedadas, sem requisição a terceiros e
  sem layout shift.
- Imagens com `next/image`: formatos modernos, `sizes` responsivo e `priority` na imagem do hero (LCP).
- Mapa do percurso e logotipo em **SVG inline** — leves e nítidos em qualquer tela.
- Favicon em SVG + ICO multi‑resolução + ícone Apple.

### Banco de dados
- **Pool de conexões** único por processo (reaproveitado no hot reload), limitado a 5 conexões.
- `statement_timeout` de 15 s: uma consulta travada nunca prende uma conexão indefinidamente.
- Índices em `status`, `phone` e no histórico por `(registration_id, created_at)`.
- Listagem **paginada** (25 por página) e totais calculados em uma única consulta agregada.

### Deploy
- Build **`standalone`**: imagem enxuta (~300 MB) contendo apenas o necessário para rodar.
- Dockerfile **multi‑stage** com cache de dependências.
- Healthcheck no container e **migração automática** com novas tentativas enquanto o banco inicia.

## Acessibilidade e experiência

- Animações respeitam `prefers-reduced-motion`.
- Modais com `role="alertdialog"`, foco automático, fechamento por `Esc` e bloqueio de rolagem do fundo.
- Navegação por teclado, `aria-current` no menu, rótulos em todos os campos e mensagens de erro anunciadas.
- Layout sem rolagem horizontal do celular ao desktop.
- Datas exibidas no fuso de Camocim (`America/Fortaleza`) e valores em reais.

## Como rodar localmente

**Pré‑requisitos:** Node.js 22+ e um PostgreSQL acessível.

```bash
# 1. Instalar dependências
npm install

# 2. Configurar o ambiente
cp .env.example .env.local   # e preencha DATABASE_URL e ADMIN_PASSWORD

# 3. Criar as tabelas
npm run db:migrate

# 4. Subir o servidor de desenvolvimento
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

> Sem PostgreSQL local? Suba um rapidamente com Docker:
> ```bash
> docker run -d --name corrida-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=corrida -p 5432:5432 postgres:17-alpine
> ```
> e use `DATABASE_URL=postgres://postgres:dev@localhost:5432/corrida`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | String de conexão do PostgreSQL. |
| `ADMIN_PASSWORD` | Sim | Senha do painel `/admin` (mínimo 8 caracteres). |
| `ADMIN_SESSION_SECRET` | Não | Segredo extra misturado à chave de assinatura das sessões. |

Chave Pix, titular, WhatsApp, valor e limite de vagas **não** são variáveis de ambiente: são
configurados pelo próprio painel, em **Configurações**.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack). |
| `npm run build` | Build de produção. |
| `npm run start` | Servidor de produção local. |
| `npm run lint` | ESLint. |
| `npm run db:migrate` | Cria/atualiza as tabelas (idempotente, pode rodar várias vezes). |

## Deploy

O projeto está pronto para **Dokploy** (ou qualquer ambiente com Docker):

```bash
docker build -t corrida-bom-jesus .
docker run -p 3000:3000 -e DATABASE_URL=... -e ADMIN_PASSWORD=... corrida-bom-jesus
```

Ao iniciar, o container aplica a migração do banco e sobe o servidor. O passo a passo completo no
Dokploy — build type, variáveis, domínio com HTTPS e solução de problemas — está em **[DEPLOY.md](DEPLOY.md)**.

## Estrutura do projeto

```
├── db/schema.sql               # Tabelas, restrições e índices
├── scripts/migrate.mjs         # Migração (local e no container)
├── Dockerfile                  # Build multi-stage standalone
├── DEPLOY.md                   # Guia de deploy no Dokploy
└── src/
    ├── app/
    │   ├── page.tsx            # Landing page
    │   ├── api/inscricoes/     # Endpoint público de pré-inscrição
    │   └── admin/
    │       ├── login/          # Tela de login
    │       ├── (painel)/       # Painel, ficha do atleta e configurações
    │       ├── exportar/       # Exportação CSV
    │       └── actions.ts      # Server Actions do admin
    ├── components/             # Seções da landing page
    │   └── admin/              # Componentes do painel (modal, ações, formulários)
    └── lib/
        ├── db.ts               # Pool e transações
        ├── auth.ts             # Sessão assinada do admin
        ├── registrations.ts    # Regras de negócio e fila
        └── registration-shared.ts  # Validação e formatação (cliente + servidor)
```

## Modelo de dados

```mermaid
erDiagram
  settings {
    int id PK "sempre 1"
    text pix_key
    text pix_holder
    text whatsapp
    int fee_cents
    int max_registrations "nulo = sem limite"
    bool registrations_open
  }
  registrations {
    bigint id PK
    int number UK "nº na fila"
    uuid idempotency_key UK
    text name
    text phone
    text modality "3km (5km só em registros antigos)"
    text category "masculino | feminino"
    text status "pendente | confirmada | cancelada"
    bool kit_delivered
    text notes
    int version "concorrência otimista"
  }
  registration_events {
    bigint id PK
    bigint registration_id FK
    text type
    jsonb detail
    timestamptz created_at
  }
  registrations ||--o{ registration_events : "histórico"
```

## Próximos passos

Melhorias possíveis para edições futuras:

- Limite de requisições por IP no endpoint público e no login (rate limiting).
- Usuários individuais no admin, com registro de quem fez cada alteração.
- Envio automático de confirmação por WhatsApp/e‑mail.
- Testes automatizados de concorrência no CI.

---

<div align="center">
Desenvolvido por <strong>Assis Junior • Web &amp; Marketing</strong> — Camocim, Ceará
</div>
