import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getProject } from '@/lib/dal'
import ProjectForm from '@/app/components/ProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, project] = await Promise.all([getCurrentUser(), getProject(parseInt(id))])

  if (!user) redirect('/signin')
  if (!project) notFound()
  if (user.id !== project.ownerId) redirect(`/projects/${id}`)

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link
        href={`/projects/${id}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Project
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <ProjectForm project={project} isEditing={true} />
      </div>
    </div>
  )
}
