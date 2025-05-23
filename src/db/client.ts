import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema' // seus schemas do drizzle

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ou string direta
})

export const db = drizzle(pool, { schema })
