import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

import dotenv from 'dotenv'

dotenv.config() // carrega o .env na memória

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}
const client = postgres(process.env.DATABASE_URL)

export const db = drizzle(client, { schema })
