// Cria/atualiza as tabelas no banco apontado por DATABASE_URL.
// Uso: npm run db:migrate
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL não definida. Coloque-a no arquivo .env.local.");
  process.exit(1);
}

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url });

try {
  await client.connect();
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
