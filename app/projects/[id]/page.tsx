import { getCurrentUser, getProject } from '@/lib/dal'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeftIcon, Edit2Icon, ClapperboardIcon, PlusIcon } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Badge from '@/app/components/ui/Badge'
import StatsBar from '@/app/components/StatsBar'
import DashboardFilters from '@/app/components/DashboardFilters'
import SortableHeader from '@/app/components/SortableHeader'
import DeleteProjectButton from '@/app/components/DeleteProjectButton'
import { PRODUCTION_PHASE, ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'
import { Status, Priority } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils'

const PHASE_COLORS = {
  pre_production: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  production: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  post_production: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'
const PRIORITY_ORDER = { low: 0, medium: 1, high: 2 }
const STATUS_ORDER = { backlog: 0, todo: 1, in_progress: 2, done: 3 }

type SearchParams = Promise<{ search?: string; status?: string; priority?: string; sort?: string; order?: string }>

export default function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: SearchParams
}) {
  return (
    <Suspense fallback={null}>
      <ProjectPageInner params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function ProjectPageInner({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: SearchParams
}) {
  const { id } = await params
  const sp = await searchParams
  const [user, project] = await Promise.all([getCurrentUser(), getProject(parseInt(id))])

  if (!user) redirect('/signin')
  if (!project) notFound()

  const isOwner = user.id === project.ownerId
  const allIssues = project.issues ?? []

  const search = sp.search ?? ''
  const status = sp.status ?? ''
  const priority = sp.priority ?? ''
  const sort = (sp.sort ?? 'createdAt') as SortField
  const order = (sp.order ?? 'desc') as 'asc' | 'desc'

  let filtered = allIssues
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (i) => i.title.toLowerCase().includes(q) || (i.description ?? '').toLowerCase().includes(q)
    )
  }
  if (status) filtered = filtered.filter((i) => i.status === status)
  if (priority) filtered = filtered.filter((i) => i.priority === priority)
  filtered = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sort === 'title') cmp = a.title.localeCompare(b.title)
    else if (sort === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    else if (sort === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    else if (sort === 'dueDate') {
      const aT = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
      const bT = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
      cmp = aT - bT
    } else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return order === 'asc' ? cmp : -cmp
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Productions
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClapperboardIcon size={24} className="text-gray-400" />
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PHASE_COLORS[project.phase]}`}>
                {PRODUCTION_PHASE[project.phase].label}
              </span>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link href={`/projects/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <span className="flex items-center">
                    <Edit2Icon size={16} className="mr-1" />
                    Edit
                  </span>
                </Button>
              </Link>
              <DeleteProjectButton id={project.id} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6 mb-6">
        {project.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Owner</p>
            <p className="font-medium">{project.owner.email}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Start Date</p>
            <p className="font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">End Date</p>
            <p className="font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tasks ({allIssues.length})</h2>
        <Link href={`/issues/new?projectId=${id}`}>
          <Button size="sm">
            <span className="flex items-center">
              <PlusIcon size={16} className="mr-1" />
              New Task
            </span>
          </Button>
        </Link>
      </div>

      <StatsBar issues={allIssues} />

      <Suspense fallback={null}>
        <DashboardFilters />
      </Suspense>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-4"><Suspense fallback={null}><SortableHeader label="Title" field="title" /></Suspense></div>
            <div className="col-span-2"><Suspense fallback={null}><SortableHeader label="Status" field="status" /></Suspense></div>
            <div className="col-span-2"><Suspense fallback={null}><SortableHeader label="Priority" field="priority" /></Suspense></div>
            <div className="col-span-2"><Suspense fallback={null}><SortableHeader label="Due Date" field="dueDate" /></Suspense></div>
            <div className="col-span-2"><Suspense fallback={null}><SortableHeader label="Created" field="createdAt" /></Suspense></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {filtered.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`} className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-4 font-medium truncate">{issue.title}</div>
                  <div className="col-span-2">
                    <Badge status={issue.status as Status}>{ISSUE_STATUS[issue.status as Status].label}</Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge priority={issue.priority as Priority}>{ISSUE_PRIORITY[issue.priority as Priority].label}</Badge>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(issue.createdAt))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high">
          {allIssues.length === 0 ? (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks yet for this production.</p>
              <Link href={`/issues/new?projectId=${id}`}>
                <Button size="sm">
                  <span className="flex items-center"><PlusIcon size={16} className="mr-1" />New Task</span>
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No matching tasks. Try adjusting your filters.</p>
          )}
        </div>
      )}
    </div>
  )
}
