import { getCurrentUser, getUsers, getAllProjects } from "@/lib/dal"
import { redirect } from "next/navigation"
import IssueForm from "./IssueForm"

const NewIssue = async ({ projectId }: { projectId?: number }) => {
  const [user, users, projects] = await Promise.all([getCurrentUser(), getUsers(), getAllProjects()])
  if (!user) {
    redirect('/signin')
  }
  return <IssueForm userId={user.id} users={users} projects={projects} defaultProjectId={projectId} />
}

export default NewIssue
