import IssueHandler from '../../modules/issue-tracker/issue-handler'

export default function issues(req, res) {
  if (req.method === 'GET') return IssueHandler.getProjects(req, res)
}
