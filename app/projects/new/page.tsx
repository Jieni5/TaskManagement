import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/dal'
import { redirect } from 'next/navigation'
import ProjectForm from '@/app/components/ProjectForm'

export default async function NewProjectPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Projects
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Project</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
