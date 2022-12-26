import IssueHandler from '../../../modules/issue-tracker/issue-handler.js'

export default function project(req, res) {
  switch (req.method) {
    case 'GET':
      IssueHandler.getProjectIssues(req, res)
      break
    case 'POST':
      IssueHandler.appendIssue(req, res)
      break
    case 'PATCH':
      IssueHandler.updateIssue(req, res)
      break
    case 'DELETE':
      IssueHandler.deleteIssue(req, res)
      break
    default:
      res.status(404).json({ error: 'unhandled api route' })
  }
}
