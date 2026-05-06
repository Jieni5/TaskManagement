'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Project, PRODUCTION_PHASE } from '@/db/schema'
import Button from './ui/Button'
import { Form, FormGroup, FormLabel, FormInput, FormTextarea, FormSelect, FormError } from './ui/Form'
import { createProject, updateProject, ProjectActionResponse } from '@/app/actions/projects'

interface ProjectFormProps {
  project?: Project
  isEditing?: boolean
}

const initialState: ProjectActionResponse = { success: false, message: '' }

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState<ProjectActionResponse, FormData>(
    async (prev, formData) => {
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        phase: formData.get('phase') as 'pre_production' | 'production' | 'post_production',
        startDate: (formData.get('startDate') as string) || null,
        endDate: (formData.get('endDate') as string) || null,
      }

      const result = isEditing
        ? await updateProject(project!.id, data)
        : await createProject(data)

      if (result.success) {
        if (isEditing) {
          router.push(`/projects/${project!.id}`)
        } else {
          router.push(`/projects/${result.projectId}`)
        }
        router.refresh()
      }

      return result
    },
    initialState
  )

  const phaseOptions = Object.values(PRODUCTION_PHASE).map(({ label, value }) => ({ label, value }))

  return (
    <Form action={formAction}>
      {state?.message && !state.success && <FormError className="mb-4">{state.message}</FormError>}

      <FormGroup>
        <FormLabel htmlFor="name">Project Name</FormLabel>
        <FormInput
          id="name"
          name="name"
          placeholder="e.g. The Last Take"
          defaultValue={project?.name || ''}
          required
          disabled={isPending}
          className={state?.errors?.name ? 'border-red-500' : ''}
        />
        {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormTextarea
          id="description"
          name="description"
          placeholder="Brief synopsis or project notes..."
          rows={3}
          defaultValue={project?.description || ''}
          disabled={isPending}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="phase">Production Phase</FormLabel>
        <FormSelect
          id="phase"
          name="phase"
          defaultValue={project?.phase || 'pre_production'}
          options={phaseOptions}
          disabled={isPending}
          required
        />
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="startDate">Start Date</FormLabel>
          <FormInput
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
            disabled={isPending}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="endDate">End Date</FormLabel>
          <FormInput
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
            disabled={isPending}
          />
        </FormGroup>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </Form>
  )
}
