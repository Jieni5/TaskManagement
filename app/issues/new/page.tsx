import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import NewIssue from '@/app/components/NewIssue'

export default function NewIssuePage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Suspense fallback={<div className="animate-pulse h-6 bg-gray-100 dark:bg-dark-elevated rounded mb-6 w-32" />}>
        <NewIssueInner searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function NewIssueInner({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const { projectId } = await searchParams
  const parsedProjectId = projectId ? parseInt(projectId) : undefined
  const backHref = projectId ? `/projects/${projectId}` : '/dashboard'

  return (
    <>
      <Link
        href={backHref}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        {projectId ? 'Back to Project' : 'Back to Dashboard'}
      </Link>

      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <NewIssue projectId={parsedProjectId} />
      </div>
    </>
  )
}
