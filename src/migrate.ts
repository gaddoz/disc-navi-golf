// import "dotenv/config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./api/db";
// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "./drizzle/migrations" });
// Don't forget to close the connection, otherwise the script will hang
// await connection.end();
// sqli-lite3 connection??
