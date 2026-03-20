import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

const isNeon = process.env.DATABASE_URL?.includes('neon.tech')
console.log('Using driver:', isNeon ? 'neon-http' : 'postgres')

export const db = isNeon
  ? drizzleNeon({ client: neon(process.env.DATABASE_URL!), schema, casing: 'snake_case' })
  : drizzlePostgres(process.env.DATABASE_URL!, { schema, casing: 'snake_case' })

