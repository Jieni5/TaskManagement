import { getCurrentUser, getUsers } from "@/lib/dal"
import { redirect } from "next/navigation"
import IssueForm from "./IssueForm"

const NewIssue = async () => {
  const [user, users] = await Promise.all([getCurrentUser(), getUsers()])
  if (!user) {
    redirect('/signin')
  }
  return <IssueForm userId={user.id} users={users} />
}

export default NewIssue
