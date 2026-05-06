import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('Running Phase 2 migration...')

  // 1. Create enums (skip if already exist)
  await sql`
    DO $$ BEGIN
      CREATE TYPE production_phase AS ENUM ('pre_production', 'production', 'post_production');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `
  console.log('✓ production_phase enum')

  await sql`
    DO $$ BEGIN
      CREATE TYPE department AS ENUM (
        'camera', 'lighting', 'sound', 'art', 'costume',
        'props', 'location', 'vfx', 'production', 'direction', 'general'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `
  console.log('✓ department enum')

  // 2. Create projects table
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      phase       production_phase NOT NULL DEFAULT 'pre_production',
      start_date  TIMESTAMP,
      end_date    TIMESTAMP,
      owner_id    TEXT NOT NULL,
      created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `
  console.log('✓ projects table')

  // 3. Add new columns to issues (skip if already exist)
  await sql`
    DO $$ BEGIN
      ALTER TABLE issues ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `
  console.log('✓ issues.project_id')

  await sql`
    DO $$ BEGIN
      ALTER TABLE issues ADD COLUMN department department;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `
  console.log('✓ issues.department')

  await sql`
    DO $$ BEGIN
      ALTER TABLE issues ADD COLUMN shoot_day INTEGER;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `
  console.log('✓ issues.shoot_day')

  console.log('\nMigration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
