import { drizzle as drizzleD1, DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { join } from "pathe";
import { Users } from "./../../drizzle/schema";
import { getRequestEvent } from "solid-js/web";

export * as tables from "./../../drizzle/schema";

const schema = {
    users: Users,
};

let _db:
    | DrizzleD1Database<typeof schema>
    | BetterSQLite3Database<typeof schema>
    | null = null;

export const getDB = () => {
    const event = getRequestEvent();

    const D1 = event?.nativeEvent?.context?.cloudflare?.env.DB;

    const isDev = !import.meta?.env?.PROD;

    console.log('D1',D1,'isdev?',isDev,D1);
    if (!_db) {
        if (D1) {
            // d1 in production
            console.log('got D1!')
            _db = drizzleD1(D1, {
                schema,
            });
        } else if (isDev) {
            console.log('got sqlite dev!');
            const sqlite = new Database( join(process.cwd(), "./drizzle/db.sqlite"));
            _db = drizzle(sqlite, {
                schema,
                logger: true,
            });
        } else {
            console.log("throwing error: No database configured for production");
            throw new Error("No database configured for production");
        }
    }
    return _db;
};