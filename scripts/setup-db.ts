/**
 * Aplica las migraciones de ./drizzle a la base.
 *   npm run db:setup
 * Usa DATABASE_URL si está definida; si no, el Postgres embebido (PGlite) en ./.data.
 */
import { mkdirSync } from "node:fs";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzleLite } from "drizzle-orm/pglite";
import { migrate as migrateLite } from "drizzle-orm/pglite/migrator";

async function main() {
  const url = process.env.DATABASE_URL;
  if (url) {
    await migratePg(drizzlePg(url), { migrationsFolder: "./drizzle" });
  } else {
    const dir = process.env.PGLITE_DIR ?? "./.data/pglite";
    mkdirSync(dir, { recursive: true });
    await migrateLite(drizzleLite(dir), { migrationsFolder: "./drizzle" });
  }
  console.log("Migraciones aplicadas.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
