import { getCurrentUser, getIssues } from '@/lib/dal'
import Link from 'next/link'
import { Suspense } from 'react'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { Priority, Status } from '@/lib/types'
import { ISSUE_STATUS, ISSUE_PRIORITY, Issue } from '@/db/schema'
import StatsBar from '../components/StatsBar'
import DashboardFilters from '../components/DashboardFilters'
import SortableHeader from '../components/SortableHeader'

type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'

const PRIORITY_ORDER = { low: 0, medium: 1, high: 2 }
const STATUS_ORDER = { backlog: 0, todo: 1, in_progress: 2, done: 3 }

function applyFiltersAndSort(
  issues: Issue[],
  search: string,
  status: string,
  priority: string,
  sort: SortField,
  order: 'asc' | 'desc'
): Issue[] {
  let result = issues

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.description ?? '').toLowerCase().includes(q)
    )
  }
  if (status) result = result.filter((i) => i.status === status)
  if (priority) result = result.filter((i) => i.priority === priority)

  result = [...result].sort((a, b) => {
    let cmp = 0
    if (sort === 'title') {
      cmp = a.title.localeCompare(b.title)
    } else if (sort === 'status') {
      cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    } else if (sort === 'priority') {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    } else if (sort === 'dueDate') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
      cmp = aTime - bTime
    } else {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return order === 'asc' ? cmp : -cmp
  })

  return result
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; priority?: string; sort?: string; order?: string }>
}) {
  await getCurrentUser()
  const issues = await getIssues()
  const params = await searchParams

  const search = params.search ?? ''
  const status = params.status ?? ''
  const priority = params.priority ?? ''
  const sort = (params.sort ?? 'createdAt') as SortField
  const order = (params.order ?? 'desc') as 'asc' | 'desc'

  const filtered = applyFiltersAndSort(issues, search, status, priority, sort, order)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Issues</h1>
        <Link href="/issues/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Issue
            </span>
          </Button>
        </Link>
      </div>

      <StatsBar issues={issues} />

      <Suspense>
        <DashboardFilters />
      </Suspense>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-4">
              <Suspense><SortableHeader label="Title" field="title" /></Suspense>
            </div>
            <div className="col-span-2">
              <Suspense><SortableHeader label="Status" field="status" /></Suspense>
            </div>
            <div className="col-span-2">
              <Suspense><SortableHeader label="Priority" field="priority" /></Suspense>
            </div>
            <div className="col-span-2">
              <Suspense><SortableHeader label="Due Date" field="dueDate" /></Suspense>
            </div>
            <div className="col-span-2">
              <Suspense><SortableHeader label="Created" field="createdAt" /></Suspense>
            </div>
          </div>

          {/* Issue rows */}
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {filtered.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-4 font-medium truncate">
                    {issue.title}
                  </div>
                  <div className="col-span-2">
                    <Badge status={issue.status as Status}>
                      {ISSUE_STATUS[issue.status as Status].label}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge priority={issue.priority as Priority}>
                      {ISSUE_PRIORITY[issue.priority as Priority].label}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {issue.dueDate
                      ? new Date(issue.dueDate).toLocaleDateString()
                      : <span className="text-gray-300 dark:text-gray-600">—</span>}
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
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          {issues.length === 0 ? (
            <>
              <h3 className="text-lg font-medium mb-2">No issues found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by creating your first issue.
              </p>
              <Link href="/issues/new">
                <Button>
                  <span className="flex items-center">
                    <PlusIcon size={18} className="mr-2" />
                    Create Issue
                  </span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No matching issues</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
