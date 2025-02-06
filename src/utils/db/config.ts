import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

const pulsePool = new Pool({
  connectionString: process.env.PULSE_DATABASE_URL,
});

export const pulseDb = drizzle(pulsePool, { schema });
