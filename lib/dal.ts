import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { issues, users, projects } from '@/db/schema'
import { cacheTag, cacheLife } from 'next/cache'

export const getCurrentUser = cache(async () => {
    const session = await getSession()
    if (!session) {
        return null
    }
    try{
        const results = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        return results[0] || null
    } catch (error) {
        console.error(error)
        return null
    }
})

export const getUserByEmail = async (email: string) => {
    try{
        const user = await db
        .query.users.findFirst({
            where: eq(users.email, email)
        })
        return user
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getIssues(userId: string) {
  'use cache'
  cacheTag(`issues-${userId}`)
  cacheLife('weeks')
  try {
    const result = await db.query.issues.findMany({
      where: eq(issues.userId, userId),
      with: {
        user: true,
        project: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}

export const getIssue = async(id:number) =>{
  try{
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, id),
      with: { user: true },
    })
    return issue
  }catch(error){
    console.error(error)
    return null
  }
}

export async function getProjects(ownerId: string) {
  try {
    return await db.query.projects.findMany({
      where: eq(projects.ownerId, ownerId),
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getProject(id: number) {
  try {
    return await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: { owner: true, issues: true },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAllProjects(ownerId: string) {
  try {
    return await db.query.projects.findMany({
      where: eq(projects.ownerId, ownerId),
      with: { owner: true },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })
  } catch (error) {
    console.error(error)
    return []
  }
}
