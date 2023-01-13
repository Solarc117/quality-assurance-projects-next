import LibraryHandler from '../../../modules/personal-library/library-handler'

export default function postCommentEndpoint(req, res) {
  switch (req.method) {
    case 'POST':
      return LibraryHandler.addComment(req, res)
    default:
      res.status(404).json({ error: 'unhandled api route' })
  }
}
