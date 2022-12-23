import IssueHandler from '../../../modules/issue-tracker/issue-handler.js'

export default function project(req, res) {
  if (req.method === 'GET') return IssueHandler.getProjectIssues(req, res)
  if (req.method === 'POST') return IssueHandler.appendIssue(req, res)
  if (req.method === 'PATCH') return IssueHandler.updateIssue(req, res)
}
