import postgres from 'postgres'
import chalk from 'chalk'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

import dotenv from 'dotenv'

dotenv.config() // carrega o .env na memória

const connection = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(connection)

await migrate(db, { migrationsFolder: 'drizzle' })

console.log(chalk.greenBright('Migrations applied successfully!'))

await connection.end()

process.exit()
