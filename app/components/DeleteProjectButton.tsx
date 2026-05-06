'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import { Trash2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteProject } from '@/app/actions/projects'

export default function DeleteProjectButton({ id }: { id: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(id)
      if (result.success) {
        toast.success('Project deleted')
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)} disabled={isPending}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isPending}>Delete</Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setShowConfirm(true)}>
      <span className="flex items-center">
        <Trash2Icon size={16} className="mr-1" />
        Delete
      </span>
    </Button>
  )
}
