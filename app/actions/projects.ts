'use server'

import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/dal'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'

const ProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().optional().nullable(),
  phase: z.enum(['pre_production', 'production', 'post_production']),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

export type ProjectActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  projectId?: number
}

export async function createProject(data: z.infer<typeof ProjectSchema>): Promise<ProjectActionResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    const parsed = ProjectSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const { name, description, phase, startDate, endDate } = parsed.data
    const result = await db.insert(projects).values({
      name,
      description: description || null,
      phase,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      ownerId: user.id,
    }).returning({ id: projects.id })

    revalidateTag('projects')
    return { success: true, message: 'Project created successfully', projectId: result[0].id }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to create project' }
  }
}

export async function updateProject(id: number, data: Partial<z.infer<typeof ProjectSchema>>): Promise<ProjectActionResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    const parsed = ProjectSchema.partial().safeParse(data)
    if (!parsed.success) {
      return { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const updateData: Record<string, unknown> = {}
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description || null
    if (parsed.data.phase !== undefined) updateData.phase = parsed.data.phase
    if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null
    if (parsed.data.endDate !== undefined) updateData.endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null

    const result = await db.update(projects).set(updateData)
      .where(and(eq(projects.id, id), eq(projects.ownerId, user.id)))

    if (result.rowCount === 0) return { success: false, message: 'Not authorized to edit this project' }

    revalidateTag('projects')
    return { success: true, message: 'Project updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to update project' }
  }
}

export async function deleteProject(id: number): Promise<ProjectActionResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    const result = await db.delete(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, user.id)))

    if (result.rowCount === 0) return { success: false, message: 'Not authorized to delete this project' }

    revalidateTag('projects')
    return { success: true, message: 'Project deleted successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to delete project' }
  }
}
