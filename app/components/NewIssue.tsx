import { getCurrentUser } from "@/lib/dal"
import IssueForm from "./IssueForm"

const NewIssue = async () => {
  const user = await getCurrentUser()
  if (!user) {
    <div>something wrong</div>
  }
  return <IssueForm userId={user?.id} />
}

export default NewIssue
