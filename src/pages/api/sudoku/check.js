import SudokuHandler from '../../../modules/sudoku-solver/handler.js'

export default function checkEndpoint(req, res) {
  switch (req.method) {
    case 'POST':
      return SudokuHandler.check(req, res)
    default:
      res.status(404).json({ error: 'unhandled api route' })
  }
}
