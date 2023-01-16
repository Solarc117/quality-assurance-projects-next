import IssueHandler from '../../modules/issue-tracker/issue-handler.js'

export default function issues(req, res) {
  if (req.method === 'GET') return IssueHandler.getProjects(req, res)
}
