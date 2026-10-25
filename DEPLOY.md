# Deploy no Dokploy

O projeto já vem pronto para o Dokploy: o `Dockerfile` gera uma imagem enxuta do Next.js
e, a cada início, **cria/atualiza as tabelas do banco sozinho** (não precisa rodar
`npm run db:migrate` no servidor).

## 1. Criar a aplicação

1. No Dokploy, abra o **mesmo projeto onde está o banco** `bom-jesus-db`.
2. **Create Service → Application**. Nome sugerido: `corrida-site`.
3. Aba **General → Provider**:
   - **GitHub** → repositório `AssFerj/corrida-com-bom-jesus`, branch `main`.
     (Se o GitHub ainda não estiver conectado: *Settings → Git → GitHub* e instale o app do Dokploy na sua conta.)
4. **Build Type**: `Dockerfile` · Docker File: `Dockerfile` · Docker Context Path: `.`
5. Salve.

## 2. Variáveis de ambiente

Aba **Environment**, cole e preencha:

```env
DATABASE_URL=postgres://USUARIO:SENHA@HOST_INTERNO:5432/bom-jesus-db
ADMIN_PASSWORD=uma-senha-forte-com-12-ou-mais-caracteres
```

- Use a **Internal Connection URL** do banco (aba *General* do banco no Dokploy).
  O host é o nome interno do serviço e a porta é **5432**, não a 5435 externa.
- `ADMIN_PASSWORD` é a senha do `/admin`. Trocá-la desconecta todos que estiverem logados.

## 3. Domínio com HTTPS

Aba **Domains → Add Domain**:

| Campo | Valor |
|---|---|
| Host | `seudominio.com.br` (ou `inscricoes.seudominio.com.br`) |
| Path | `/` |
| Container Port | `3000` |
| HTTPS | ligado |
| Certificate | `Let's Encrypt` |

No painel do seu domínio (Registro.br, Cloudflare etc.) crie um registro **A** apontando
para o IP do servidor: `169.58.202.82`. Se usar Cloudflare, deixe a nuvem **cinza**
(somente DNS) até o certificado ser emitido.

> O login do admin precisa de HTTPS no domínio final. Sem domínio, dá para testar pelo
> domínio gratuito `*.traefik.me` que o Dokploy oferece no botão **Generate Domain**.

## 4. Subir

1. Clique em **Deploy** e acompanhe em **Deployments** (o build leva de 2 a 4 minutos).
2. Em **Logs** deve aparecer:
   ```
   Banco atualizado com sucesso.
   ✓ Ready
   ```
3. Abra o domínio → site. Depois `/admin` → entre com a `ADMIN_PASSWORD` →
   **Configurações** → cadastre chave Pix, titular e WhatsApp.

## 5. Atualizações

- Ligue **Auto Deploy** (aba *General*): todo `git push` na `main` publica sozinho.
- Ou clique em **Deploy** manualmente quando quiser.
- Se uma versão der problema: aba **Deployments → Rollback** para a anterior.

## 6. Segurança depois de publicar

- Com o site usando a URL **interna** do banco, a porta externa **5435** não é mais
  necessária. Remova a *External Port* do banco no Dokploy (ou restrinja ao seu IP no
  firewall). Para rodar `npm run db:migrate` do seu computador de novo, reabra só quando precisar.
- A porta **5432** do servidor também está aberta para a internet. Confira se é intencional.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Logs repetem `Banco indisponível... [n/10]` e o container reinicia | `DATABASE_URL` errada ou banco em outro servidor/projeto. Use a URL interna. |
| `DATABASE_URL não definida` | Variável não salva na aba Environment (salve e faça **Deploy** de novo). |
| Login do admin volta para a tela de senha | Acessando por `http://`. Use o domínio com HTTPS. |
| `ADMIN_PASSWORD não definida` ao abrir `/admin` | Falta a variável ou ela tem menos de 8 caracteres. |
| 404 / Bad Gateway no domínio | Container Port diferente de `3000` ou DNS ainda propagando. |
