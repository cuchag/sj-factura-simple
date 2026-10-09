import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Cliente que usa el sistema. Multi-empresa desde el inicio. */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  cuit: text("cuit").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
