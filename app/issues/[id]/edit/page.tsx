import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, getIssue } from '@/lib/dal'
import IssueForm from '@/app/components/IssueForm'

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [user, issue] = await Promise.all([
    getCurrentUser(),
    getIssue(parseInt(id)),
  ])

  if (!user) redirect('/signin')
  if (!issue) notFound()

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link
        href={`/issues/${id}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Issue
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Issue</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <IssueForm issue={issue} userId={user.id} isEditing={true} />
      </div>
    </div>
  )
}
