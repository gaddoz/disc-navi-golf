import { defineConfig } from 'drizzle-kit';
import { join } from "pathe";
export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
      url: join(process.cwd(), "./drizzle/db.sqlite"),
  },
});