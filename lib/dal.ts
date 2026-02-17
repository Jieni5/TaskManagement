import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { issues, users } from '@/db/schema'
import { mockDelay } from './utils'
import { cacheTag, cacheLife } from 'next/cache'

export const getCurrentUser = cache(async () => {
    console.log("get current user called")
    await mockDelay(1000) 
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

export async function getIssues() {
  'use cache'
  cacheTag('issues')
  try {
    await mockDelay(1000) // Simulate network delay
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    cacheLife('weeks')
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}

export const getIssue = async(id:number) =>{
  await mockDelay(1000)
  try{
    const issue = await db.query.issues.findFirst({where: eq(issues.id, id), with:{user:true}})
    return issue
  }catch(error){
    console.error(error)
    return null
  }
  
}