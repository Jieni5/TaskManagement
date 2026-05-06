import { InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core'

// Enums for issue status and priority
export const statusEnum = pgEnum('status', [
  'backlog',
  'todo',
  'in_progress',
  'done',
])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])
export const productionPhaseEnum = pgEnum('production_phase', [
  'pre_production',
  'production',
  'post_production',
])
export const departmentEnum = pgEnum('department', [
  'camera',
  'lighting',
  'sound',
  'art',
  'costume',
  'props',
  'location',
  'vfx',
  'production',
  'direction',
  'general',
])

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  phase: productionPhaseEnum('phase').default('pre_production').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Issues table
export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').default('backlog').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  dueDate: timestamp('due_date'),
  assignee: text('assignee'),
  projectId: integer('project_id'),
  department: departmentEnum('department'),
  shootDay: integer('shoot_day'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: text('user_id').notNull(),
})

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  issues: many(issues),
}))

export const issuesRelations = relations(issues, ({ one }) => ({
  user: one(users, {
    fields: [issues.userId],
    references: [users.id],
    relationName: 'creator',
  }),
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues, { relationName: 'creator' }),
  projects: many(projects),
}))

// Types
export type Issue = InferSelectModel<typeof issues>
export type User = InferSelectModel<typeof users>
export type Project = InferSelectModel<typeof projects>

// Status and priority labels for display
export const ISSUE_STATUS = {
  backlog: { label: 'Backlog', value: 'backlog' },
  todo: { label: 'Todo', value: 'todo' },
  in_progress: { label: 'In Progress', value: 'in_progress' },
  done: { label: 'Done', value: 'done' },
}

export const ISSUE_PRIORITY = {
  low: { label: 'Low', value: 'low' },
  medium: { label: 'Medium', value: 'medium' },
  high: { label: 'High', value: 'high' },
}

export const PRODUCTION_PHASE = {
  pre_production: { label: 'Pre-Production', value: 'pre_production' },
  production: { label: 'Production', value: 'production' },
  post_production: { label: 'Post-Production', value: 'post_production' },
}

export const DEPARTMENT = {
  camera: { label: 'Camera', value: 'camera' },
  lighting: { label: 'Lighting', value: 'lighting' },
  sound: { label: 'Sound', value: 'sound' },
  art: { label: 'Art', value: 'art' },
  costume: { label: 'Costume', value: 'costume' },
  props: { label: 'Props', value: 'props' },
  location: { label: 'Location', value: 'location' },
  vfx: { label: 'VFX', value: 'vfx' },
  production: { label: 'Production', value: 'production' },
  direction: { label: 'Direction', value: 'direction' },
  general: { label: 'General', value: 'general' },
}
