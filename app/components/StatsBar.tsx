import { Issue } from '@/db/schema'

interface StatsBarProps {
  issues: Issue[]
}

export default function StatsBar({ issues }: StatsBarProps) {
  const total = issues.length
  const backlog = issues.filter((i) => i.status === 'backlog').length
  const todo = issues.filter((i) => i.status === 'todo').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const done = issues.filter((i) => i.status === 'done').length

  const stats = [
    { label: 'Total', count: total, className: 'text-gray-700 dark:text-gray-200' },
    { label: 'Backlog', count: backlog, className: 'text-gray-500 dark:text-gray-400' },
    { label: 'Todo', count: todo, className: 'text-amber-600 dark:text-amber-400' },
    { label: 'In Progress', count: inProgress, className: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Done', count: done, className: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {stats.map(({ label, count, className }) => (
        <div
          key={label}
          className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg px-4 py-3"
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${className}`}>{count}</p>
        </div>
      ))}
    </div>
  )
}
