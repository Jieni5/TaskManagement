import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Everything your production needs, from first day of prep to picture lock.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          title="Production Phases"
          description="Organize your project across pre-production, production, and post. Track what phase each task belongs to."
        />
        <FeatureCard
          title="Department Tasks"
          description="Assign tasks to Camera, Sound, Art, Costume, Grip, and more. Every department stays on the same page."
        />
        <FeatureCard
          title="Shoot Day Planning"
          description="Tag tasks to specific shoot days. Filter your dashboard to see exactly what's needed on any given day."
        />
        <FeatureCard
          title="Crew Assignment"
          description="Assign tasks to specific crew members. Everyone knows what they're responsible for."
        />
        <FeatureCard
          title="Project Overview"
          description="See all tasks linked to a project at a glance. Track start dates, end dates, and overall progress."
        />
        <FeatureCard
          title="Search & Filter"
          description="Find any task instantly. Filter by status, priority, department, or search by title."
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-dark-elevated p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border-default">
      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
  )
}
