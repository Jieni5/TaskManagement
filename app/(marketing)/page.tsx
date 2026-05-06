import Link from 'next/link'
import Button from '../components/ui/Button'
import { ClapperboardIcon, UsersIcon, CalendarIcon, LayoutIcon } from 'lucide-react'

export default async function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ClapperboardIcon size={48} className="text-amber-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Production logistics,{' '}
              <br className="hidden sm:block" />
              <span className="text-amber-500">on one page.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Callsheet keeps your indie film production on track — tasks, crew, departments, and shoot days, all in one place.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">See Features</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="bg-gray-50 dark:bg-dark-elevated border-y border-gray-200 dark:border-dark-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <ClapperboardIcon size={28} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Projects & Phases</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Organize work by production phase — pre-production, production, post.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <LayoutIcon size={28} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Task Tracking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assign tasks by department, shoot day, and priority. Nothing falls through the cracks.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <UsersIcon size={28} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Crew Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track crew members, roles, and departments across your production.</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CalendarIcon size={28} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shoot Day View</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Filter tasks by shoot day. Know exactly what's happening on any given day on set.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
