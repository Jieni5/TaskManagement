import { getCurrentUser, getAllProjects } from "@/lib/dal"
import { redirect } from "next/navigation"
import IssueForm from "./IssueForm"

const NewIssue = async ({ projectId }: { projectId?: number }) => {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  const projects = await getAllProjects(user.id)
  return <IssueForm userId={user.id} projects={projects} defaultProjectId={projectId} />
}

export default NewIssue
