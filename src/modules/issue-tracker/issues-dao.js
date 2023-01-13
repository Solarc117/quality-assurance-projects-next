import clientPromise from '../../../lib/mongodb.js'
import '../../../types/index.js'

const log = console.log.bind(console),
  error = console.error.bind(console),
  {
    env: { NODE_ENV },
  } = process,
  COLLECTION = NODE_ENV === 'production' ? 'projects' : 'test'
let DB

// 📄 I don't yet know the difference between declaring DB as a global variable in this file (the current setup), and declaring it as a property in the IssuesDAO class.
export default class IssuesDAO {
  /**
   * @description Impure; attempts to assign the "issue-tracker" db's "projects" or "test" collection to the argument, if undefined. Logs a message if a connection is already established.
   * @returns {Promise<void>}
   */
  static async connect() {
    if (DB)
      return log(
        `IssuesDAO connection to ${COLLECTION} collection already established`
      )

    try {
      DB = await (await clientPromise)
        .db('issue-tracker')
        .collection(COLLECTION)

      log(`IssuesDAO connected to ${COLLECTION} collection`)
    } catch (error) {
      error(`unable to connect IssuesDAO to ${COLLECTION} collection:`, error)
    }
  }

  /**
   * @description Attempts to fetch all projects in db, & returns their titles.
   * @returns {Promise<[string] | { error: string }>}
   */
  static async fetchProjects() {
    if (!DB) await this.connect()

    try {
      const result = await DB.find(
        {},
        {
          projection: {
            _id: 0,
            project: 1,
          },
        }
      ).toArray()

      return result
    } catch (err) {
      error('error fetching projects:', err)

      return { error: err.message }
    }
  }

  /**
   * @description Attempts to fetch a single Project document matching the passed project name. If an index argument exists, returns the issue under said index.
   * @param {string} projectName The name of the project.
   * @param {number} [issueIndex] The index of a single issue to project, if any.
   * @returns {Promise<{ error: string } | Project | null>} An object containing an error property if the find method fails, or a document or null depending on whether a match was found.
   */
  static async fetchProject(projectName, issueIndex) {
    if (!DB) await this.connect()

    // Filters the issues array after finding a match. Might be possibile to integrate a pipeline for this functionality - maybe reformat the document structure to each individually represent an issue, and have the collection represent the project?
    try {
      const matchProject = {
          $match: {
            project: projectName,
          },
        },
        getIssueAtIndex = {
          $project: {
            _id: 0,
            issue: {
              $arrayElemAt: ['$issues', issueIndex],
            },
          },
        },
        pipeline = [matchProject]
      if (typeof issueIndex === 'number')
        // @ts-ignore
        pipeline.push(getIssueAtIndex)

      const result = await DB.aggregate(pipeline).toArray()

      return result[0]
    } catch (err) {
      error(`error querying ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }

  /**
   * @description Appends the issue to the project argument, creating the project document if it does not exist.
   * @param {Issue} issue The issue object to append.
   * @param {string} project The name of the project to be upserted into the collection.
   * @param {string} [owner] The owner of the project (if creating a new project).
   * @returns {Promise<object>} The collection.updateOne response, or an object containing an error property if the attempt failed.
   */
  static async upsertProject(issue, project, owner) {
    if (!DB) await this.connect()

    try {
      const query = { project },
        operators = {
          $push: {
            issues: issue,
          },
        },
        options = { upsert: true }
      if (typeof owner === 'string' && owner.length > 0) query.owner = owner

      const result = await DB.updateOne(query, operators, options)

      return result
    } catch (err) {
      error(`error upserting ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }

  /**
   * @description Attempts to post (upload) the passed object to the connected collection.
   * @param {Project} project The object to post to the respective collection.
   * @returns {Promise<null | { error: string } | { acknowledged: string, insertedId: string | null | undefined }>}
   */
  static async createProject(project) {
    if (!DB) await this.connect()

    try {
      const result = await DB.insertOne(project)

      return result
    } catch (err) {
      error(`unable to insert document in ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }

  /**
   * @description Attempts to update a single issue in the database.
   * @param {object} query An object containing the index of the issue to update, and the title of the project that the issue pertains to.
   * @param {Promise<object>} fieldsToUpdate The fields of the issue to update, containing their new values.
   */
  static async updateIssue(query, fieldsToUpdate) {
    if (!DB) await this.connect()

    const { project, index } = query,
      filter = { project },
      command = {
        $set: {},
      }

    for (const key of Object.keys(fieldsToUpdate))
      command.$set[`issues.${index}.${key}`] = fieldsToUpdate[key]

    try {
      const result = await DB.updateOne(filter, command)

      return result
    } catch (err) {
      error(`unable to update document in ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }

  /**
   * @description Deletes the issue at the given index from a project.
   * @param {string} project The name of the project that the issue pertains to.
   * @param {number} index The index of the issue to delete.
   * @returns {Promise<object | null>} The result of the operaton.
   */
  static async deleteIssue(project, index) {
    if (!DB) await this.connect()

    const deleteIssuePipeline = [
      {
        $replaceWith: {
          $setField: {
            field: 'issues',
            input: '$$ROOT',
            value: {
              $cond: {
                if: { $eq: [{ $size: '$issues' }, 0] },
                then: [],
                else:
                  index === 0
                    ? {
                        $slice: ['$issues', 1, { $size: '$issues' }],
                      }
                    : {
                        $concatArrays: [
                          { $slice: ['$issues', 0, index] },
                          {
                            $slice: [
                              '$issues',
                              index + 1,
                              { $size: '$issues' },
                            ],
                          },
                        ],
                      },
              },
            },
          },
        },
      },
    ]

    try {
      const deleteResult = await DB.updateOne({ project }, deleteIssuePipeline)

      return deleteResult
    } catch (err) {
      error(`unable to delete issue in ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }

  /**
   * @description Drops the test collection if currently connected to it.
   * @returns {Promise<object | null>} The result of the drop operation, or an object containing an error property if the operation failed or was unable to execute.
   */
  static async dropTest() {
    if (NODE_ENV !== 'development')
      return {
        error: `unable to drop ${COLLECTION} collection in a production environment`,
      }
    if (!DB) await this.connect()

    try {
      const dropResult = await DB.drop()

      return dropResult
    } catch (err) {
      if (err.codeName === 'NamespaceNotFound')
        return log(`${COLLECTION} collection does not exist`)

      error(`unsuccessful drop command on ${COLLECTION} collection:`, err)
      return { error: err.message }
    }
  }
}
