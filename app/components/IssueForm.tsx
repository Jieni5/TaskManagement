'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Issue, ISSUE_STATUS, ISSUE_PRIORITY, DEPARTMENT, Project } from '@/db/schema'
import Button from './ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormError,
} from './ui/Form'
import { createIssue, updateIssues, ActionResponse } from '@/app/actions/issues'
import toast from 'react-hot-toast'

interface IssueFormProps {
  issue?: Issue
  userId: string
  isEditing?: boolean
  users?: { id: string; email: string }[]
  projects?: Pick<Project, 'id' | 'name'>[]
  defaultProjectId?: number
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export default function IssueForm({
  issue,
  userId,
  isEditing = false,
  users = [],
  projects = [],
  defaultProjectId,
}: IssueFormProps) {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    // Extract data from form
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as
        | 'backlog'
        | 'todo'
        | 'in_progress'
        | 'done',
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      userId,
      dueDate: (formData.get('dueDate') as string) || null,
      assigneeId: (formData.get('assigneeId') as string) || null,
      projectId: formData.get('projectId') ? parseInt(formData.get('projectId') as string) : null,
      department: (formData.get('department') as string) || null,
      shootDay: formData.get('shootDay') ? parseInt(formData.get('shootDay') as string) : null,
    }

    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing
        ? await updateIssues(Number(issue!.id), data)
        : await createIssue(data)

      // Handle successful submission
      if (result.success) {
        toast.success(isEditing ? 'Issue updated successfully' : 'Task created successfully')
        router.refresh()
        if (isEditing) {
          router.push(`/issues/${issue!.id}`)
        } else {
          router.push('/dashboard')
        }
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  const statusOptions = Object.values(ISSUE_STATUS).map(({ label, value }) => ({
    label,
    value,
  }))

  const priorityOptions = Object.values(ISSUE_PRIORITY).map(
    ({ label, value }) => ({
      label,
      value,
    })
  )

  return (
    <Form action={formAction}>
      {state?.message && !state.success && (
        <FormError className="mb-4">
          {state.message}
        </FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="title">Title</FormLabel>
        <FormInput
          id="title"
          name="title"
          placeholder="Issue title"
          defaultValue={issue?.title || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormTextarea
          id="description"
          name="description"
          placeholder="Describe the issue..."
          rows={4}
          defaultValue={issue?.description || ''}
          disabled={isPending}
          aria-describedby="description-error"
          className={state?.errors?.description ? 'border-red-500' : ''}
        />
        {state?.errors?.description && (
          <p id="description-error" className="text-sm text-red-500">
            {state.errors.description[0]}
          </p>
        )}
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormGroup>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            defaultValue={issue?.status || 'backlog'}
            options={statusOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
            </p>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="priority">Priority</FormLabel>
          <FormSelect
            id="priority"
            name="priority"
            defaultValue={issue?.priority || 'medium'}
            options={priorityOptions}
            disabled={isPending}
            required
            aria-describedby="priority-error"
            className={state?.errors?.priority ? 'border-red-500' : ''}
          />
          {state?.errors?.priority && (
            <p id="priority-error" className="text-sm text-red-500">
              {state.errors.priority[0]}
            </p>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="dueDate">Due Date</FormLabel>
          <FormInput
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={issue?.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : ''}
            disabled={isPending}
          />
        </FormGroup>
      </div>

      {users.length > 0 && (
        <FormGroup>
          <FormLabel htmlFor="assigneeId">Assignee</FormLabel>
          <select
            id="assigneeId"
            name="assigneeId"
            defaultValue={issue?.assigneeId ?? ''}
            disabled={isPending}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border-medium dark:bg-[#222222] dark:text-gray-100"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </FormGroup>
      )}

      {projects.length > 0 && (
        <FormGroup>
          <FormLabel htmlFor="projectId">Project</FormLabel>
          <select
            id="projectId"
            name="projectId"
            defaultValue={issue?.projectId ?? defaultProjectId ?? ''}
            disabled={isPending}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border-medium dark:bg-[#222222] dark:text-gray-100"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </FormGroup>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="department">Department</FormLabel>
          <select
            id="department"
            name="department"
            defaultValue={issue?.department ?? ''}
            disabled={isPending}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border-medium dark:bg-[#222222] dark:text-gray-100"
          >
            <option value="">No Department</option>
            {Object.values(DEPARTMENT).map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="shootDay">Shoot Day</FormLabel>
          <FormInput
            id="shootDay"
            name="shootDay"
            type="number"
            min={1}
            placeholder="e.g. 3"
            defaultValue={issue?.shootDay ?? ''}
            disabled={isPending}
          />
        </FormGroup>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Issue' : 'Create Issue'}
        </Button>
      </div>
    </Form>
  )
}