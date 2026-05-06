import { getCurrentUser, getAllProjects } from '@/lib/dal'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PlusIcon, ClapperboardIcon } from 'lucide-react'
import Button from '../components/ui/Button'
import { PRODUCTION_PHASE } from '@/db/schema'

const PHASE_COLORS = {
  pre_production: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  production: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  post_production: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')

  const projects = await getAllProjects()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Productions</h1>
        <Link href="/projects/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Production
            </span>
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors h-full">
                <div className="flex items-center gap-2 mb-2">
                  <ClapperboardIcon size={18} className="text-gray-400 shrink-0" />
                  <h2 className="font-semibold text-gray-900 dark:text-white truncate">{project.name}</h2>
                </div>
                <div className="mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PHASE_COLORS[project.phase]}`}>
                    {PRODUCTION_PHASE[project.phase].label}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {project.description}
                  </p>
                )}
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {project.startDate && (
                    <span>Starts {new Date(project.startDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          <ClapperboardIcon size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">No productions yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first film production to get started.</p>
          <Link href="/projects/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                New Production
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
