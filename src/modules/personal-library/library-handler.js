import { ObjectId } from 'mongodb'
import LibraryDAO from './library-dao.js'

export default class LibraryHandler {
  /**
   * @description Fetches all books.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async getAllBooks(req, res) {
    const result = await LibraryDAO.getBooks()

    res.status(result?.error ? 500 : 200).json(result)
  }

  /**
   * @description Attempts to post the received resources to the database.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async createBook(req, res) {
    const { body: book } = req,
      { title } = book

    if (typeof title !== 'string')
      return res.status(400).json({ error: 'missing title field' })

    if (title.trim().length === 0)
      return res.status(400).json({
        error:
          'invalid book title - must have at least one non-whitespace character',
      })

    if (!Array.isArray(book.comments)) {
      book.comments = []
      book.commentcount = 0
    }

    book.commentcount = book.comments.length

    const result = await LibraryDAO.insertBook(book)

    res.status(result?.error ? 500 : 200).json(result)
  }

  /**
   * @description Fetches a single book using its _id.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async getBook(req, res) {
    const {
        params: { _id },
      } = req,
      result = await LibraryDAO.getBookById(_id)

    res.status(result?.error ? 500 : 200).json(result)
  }

  /**
   * @description Adds a comment to the book with the passed _id.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async addComment(req, res) {
    const {
      params: { _id },
      body: { comment },
    } = req

    if (!ObjectId.isValid(_id))
      return res.status(400).json({
        error: 'please input a valid _id',
      })
    if (comment.trim().length === 0)
      return res.status(400).json({
        error:
          'invalid comment - must have at least one non-whitespace character',
      })

    const result = await LibraryDAO.appendComment(_id, comment)

    res.status(result?.error ? 500 : 200).json(result?.value ?? result)
  }

  /**
   * @description Deletes a single book using its _id.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async deleteBook(req, res) {
    const {
        params: { _id },
      } = req,
      result = await LibraryDAO.deleteSingle(_id)

    return res.status(result?.error ? 500 : 200).json(result)
  }

  /**
   * @description Deletes all books.
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   */
  static async deleteBooks(req, res) {
    const result = await LibraryDAO.deleteAll()

    res.status(result?.error ? 500 : 200).json(result)
  }
}
