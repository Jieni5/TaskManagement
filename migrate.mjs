import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('Running assignee migration...')

  // Add plain text assignee column
  await sql`
    DO $$ BEGIN
      ALTER TABLE issues ADD COLUMN assignee text;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `
  console.log('✓ issues.assignee (text) added')

  // Drop the old FK column
  await sql`
    DO $$ BEGIN
      ALTER TABLE issues DROP COLUMN IF EXISTS assignee_id;
    EXCEPTION WHEN undefined_column THEN NULL;
    END $$;
  `
  console.log('✓ issues.assignee_id dropped')

  console.log('\nMigration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
