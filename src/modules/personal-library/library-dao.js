import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb.js'
import '../../../types/index.js'

const log = console.log.bind(console),
  error = console.error.bind(console),
  { env } = process,
  COLLECTION = env.NODE_ENV === 'development' ? 'test' : 'books'
let DB

export default class LibraryDAO {
  /**
   * @description Impure; attempts to assign the "issue-tracker" db's "owners" collection to the global "owners" variable, if the global variable is undefined; logs a message if a connection is already established.
   * @async
   * @returns {Promise<void>}
   */
  static async connect() {
    if (DB)
      return log(
        `connection to ${COLLECTION} collection previously established`
      )

    try {
      DB = await (await clientPromise)
        .db('personal-library')
        .collection(COLLECTION)

      log(`LibraryDAO connected to ${COLLECTION} collection`)
    } catch (err) {
      error(`unable to connect LibraryDAO to ${COLLECTION} collection:`, err)
    }
  }

  /**
   * @description Attemps to fetch all books from the current collection.
   * @async
   * @returns {Promise<object | Array>} The result of the find operation.
   */
  static async getBooks() {
    if (!DB) await this.connect()

    try {
      const cursor = await DB.find(),
        books = await cursor.toArray()

      return books
    } catch (err) {
      error('unable to get books:', err)

      return { error: err.message }
    }
  }

  /**
   * @description Attempts to post the received book to the currently connected collection.
   * @async
   * @param {Book} book The book to post.
   * @returns {Promise<object>} The result of the insert operation.
   */
  static async insertBook(book) {
    if (!DB) await this.connect()

    try {
      const postBookResult = await DB.insertOne(book)

      return { _id: postBookResult.insertedId, title: book.title }
    } catch (err) {
      error('unable to insert book:', err)

      return { error: err.message }
    }
  }

  /**
   * @description Attempts to fetch a single book document from the connected collection, using its _id.
   * @param {string} _id The id of the book to fetch.
   * @async
   * @returns {Promise<object>} The book document, or an empty object if no document was found.
   */
  static async getBookById(_id) {
    if (!DB) await this.connect()

    try {
      const query = {
          _id: new ObjectId(_id),
        },
        result = await DB.findOne(query)

      return result === null ? {} : result
    } catch (err) {
      error('\x1b[31m', err)

      return { error: err.message }
    }
  }

  /**
   * @description Appends the passed comment to the comments array of the book with the passed id, and increments commentcount.
   * @async
   * @param {string} _id The id of the book to append to.
   * @param {string} comment The comment to append.
   * @returns {Promise<object>} The result of the update operation.
   */
  static async appendComment(_id, comment) {
    if (!DB) await this.connect()

    try {
      const query = { _id: new ObjectId(_id) },
        update = {
          $push: {
            comments: comment,
          },
          $inc: {
            commentcount: 1,
          },
        },
        options = {
          returnDocument: 'after',
        },
        updateResult = await DB.findOneAndUpdate(query, update, options)

      return updateResult
    } catch (err) {
      error('unable to append comment:', err)

      return { error: err.message }
    }
  }

  /**
   * @description Attempts to delete a single book from the database using its _id.
   * @async
   * @param {string} _id The _id of the book to delete.
   * @returns {Promise<object>} The result of the delete operation.
   */
  static async deleteSingle(_id) {
    if (!DB) await this.connect()

    try {
      const query = { _id: new ObjectId(_id) },
        result = await DB.deleteOne(query)

      return result
    } catch (err) {
      error('unable to delete book', err)

      return { error: err.message }
    }
  }

  /**
   * @description Drops the currently connected collection.
   * @async
   * @returns {Promise<object | boolean>} The result of the drop operation, or an object containing an err property in the case of a server err.
   */
  static async deleteAll() {
    if (!DB) await this.connect()

    try {
      const dropResult = await DB.drop()

      return dropResult
    } catch (err) {
      if (err.codeName === 'NamespaceNotFound')
        return log(`${COLLECTION} collection does not exist`)

      error(`unable to drop ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }
}
