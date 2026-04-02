'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from 'lucide-react'

interface SortableHeaderProps {
  label: string
  field: string
  className?: string
}

export default function SortableHeader({ label, field, className }: SortableHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort')
  const currentOrder = searchParams.get('order') ?? 'desc'
  const isActive = currentSort === field

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', field)
    params.set('order', isActive && currentOrder === 'asc' ? 'desc' : 'asc')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${className ?? ''}`}
    >
      {label}
      {isActive ? (
        currentOrder === 'asc' ? (
          <ChevronUpIcon size={14} />
        ) : (
          <ChevronDownIcon size={14} />
        )
      ) : (
        <ChevronsUpDownIcon size={14} className="opacity-40" />
      )}
    </button>
  )
}
