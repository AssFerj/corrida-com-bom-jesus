// Cria/atualiza as tabelas no banco apontado por DATABASE_URL.
// Uso local: npm run db:migrate • No Docker roda sozinho antes de iniciar o site.
// Só cria o que ainda não existe, então pode rodar quantas vezes quiser.
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL não definida (.env.local ou variáveis de ambiente do Dokploy).");
  process.exit(1);
}

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const ATTEMPTS = 10;

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10_000 });
  try {
    await client.connect();
  } catch (err) {
    // O banco pode ainda estar subindo: espera e tenta de novo
    await client.end().catch(() => {});
    if (attempt === ATTEMPTS) {
      console.error(`Não foi possível conectar ao banco: ${err.message}`);
      process.exit(1);
    }
    console.warn(`Banco indisponível (${err.message}). Nova tentativa em 3s... [${attempt}/${ATTEMPTS}]`);
    await new Promise((r) => setTimeout(r, 3000));
    continue;
  }

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("Banco atualizado com sucesso.");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Falha ao atualizar o banco:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
  break;
}
