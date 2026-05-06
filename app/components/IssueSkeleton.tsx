export default function IssueSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Back link + title row */}
      <div className="mb-8">
        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6 mb-8">
        {/* Badge row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
