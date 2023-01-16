import LibraryHandler from '../../../modules/personal-library/library-handler.js'

export default function booksEndpoint(req, res) {
  switch (req.method) {
    case 'POST':
      return LibraryHandler.createBook(req, res)
    default:
      res.status(404).json({ error: 'unhandled api route' })
  }
}
