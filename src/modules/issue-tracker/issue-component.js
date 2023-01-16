import React, { useRef, useState } from 'react'
import styles from '../../../styles/Issues.module.css'

export default function Issue() {
  function gatherValues(values, node) {
    const { name, value } = node.children[1],
      trimmedValue = value?.trim() || ''

    if (trimmedValue.length !== 0)
      if (values instanceof URLSearchParams) values.set(name, trimmedValue)
      else values[name] = trimmedValue

    return values
  }
  async function getProjects(event) {
    event.preventDefault()
    setData(JSON.stringify({ message: 'getting projects...' }, null, 2))

    const response = await fetch('/api/issues'),
      projects = await response.json()

    setData(JSON.stringify(projects, null, 2))
  }
  async function getIssues(event) {
    event.preventDefault()
    setData('{ "message": "getting issues..." }')

    const apiEndpoint = `/api/issues/${encodeURIComponent(
        // @ts-ignore
        getIssuesProject.current.value.trim()
      )}`,
      params = new URLSearchParams()

    // @ts-ignore
    Array.from(issueFilters.current.children).reduce(gatherValues, params)

    const response = await fetch(`${apiEndpoint}?${params.toString()}`),
      issues = await response.json()

    setData(JSON.stringify(issues, null, 2))
  }
  async function submitIssue(event) {
    event.preventDefault()
    setData('{ "message": "submitting issue..." }')

    const [encodedProjectName, encodedProjectOwner] = Array.from(
        // @ts-ignore
        projectNameOwner.current.children
      ).map(labelNode =>
        encodeURIComponent(labelNode.children[1].value.trim())
      ),
      apiURL = new URL(
        `/api/issues/${encodedProjectName}`,
        window.location.href
      ),
      issue = {}

    apiURL.searchParams.set('owner', encodedProjectOwner)
    // @ts-ignore
    Array.from(submitIssueFields.current.children).reduce(gatherValues, issue)

    const response = await fetch(apiURL.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application-json',
        },
        // @ts-ignore
        body: JSON.stringify(issue),
      }),
      result = await response.json()

    setData(JSON.stringify(result, null, 2))
  }
  async function fetchIssueToUpdate(event) {
    event.preventDefault()
    setData(JSON.stringify({ message: 'fetching issue to update...' }, null, 2))

    const [projectName, index] = Array.from(
        // @ts-ignore
        updateIssueFieldset.current.children
      ).map(labelNode => labelNode.childNodes[2].value),
      apiEndpoint = new URL(
        `/api/issues/${encodeURIComponent(projectName.trim())}`,
        window.location.href
      )
    apiEndpoint.searchParams.set('index', index)

    const response = await fetch(apiEndpoint.href),
      result = await response.json()

    if (typeof result?.error !== 'string' && Object.keys(result).length > 0) {
      window.sessionStorage.setItem('indexOfIssueToUpdate', `${index}`)
      window.sessionStorage.setItem('nameOfProjectToUpdate', projectName)
      setIssueToUpdate(result)
    }
    setData(JSON.stringify(result, null, 2))
  }
  async function updateIssue(event) {
    event.preventDefault()
    const [newTitle, newText, newAssignedTo, newStatusText, newOpen] =
        // @ts-ignore
        Array.from(updateIssueForm.current.childNodes).map(
          (node, i) => node.childNodes[2][i < 4 ? 'value' : 'checked']
        ),
      newIssue = {
        title: newTitle,
        text: newText,
        assigned_to: newAssignedTo,
        status_text: newStatusText,
        open: newOpen,
      }

    if (
      window.sessionStorage.getItem('indexOfIssueToUpdate') === null ||
      window.sessionStorage.getItem('nameOfProjectToUpdate') === null
    )
      return setData(
        JSON.stringify(
          {
            error:
              'please specify a project and an index for an issue in the Update Issue form',
          },
          null,
          2
        )
      )
    setData(JSON.stringify({ message: 'updating issue...' }, null, 2))

    const apiURL = new URL(
      `/api/issues/${encodeURIComponent(
        // @ts-ignore
        window.sessionStorage.getItem('nameOfProjectToUpdate')
      )}`,
      window.location.href
    )
    apiURL.searchParams.set(
      'index',
      // @ts-ignore
      window.sessionStorage.getItem('indexOfIssueToUpdate')
    )

    try {
      const response = await fetch(apiURL.href, {
          method: 'PATCH',
          body: JSON.stringify(newIssue),
          headers: {
            'Content-Type': 'application-json',
          },
        }),
        result = await response.json()

      setData(JSON.stringify(result, null, 2))
      setIssueToUpdate({})
    } catch (err) {
      setData(
        JSON.stringify({ error: 'could not complete the request' }, null, 2)
      )
      setIssueToUpdate({})
    }
  }
  async function deleteIssue(event) {
    event.preventDefault()

    const [projectName, index] = Array.from(
        // @ts-ignore
        deleteIssueFieldset.current.children
      ).map(labelNode => labelNode.childNodes[2].value),
      apiEndpoint = new URL(
        `/api/issues/${encodeURIComponent(projectName.trim())}`,
        window.location.href
      )
    apiEndpoint.searchParams.set('index', index)
    setData(JSON.stringify({ message: 'deleting issue...' }, null, 2))

    const response = await fetch(apiEndpoint.href, {
        method: 'DELETE',
      }),
      result = await response.json()

    setData(JSON.stringify(result, null, 2))
  }
  const submitFields = [
      {
        tag: 'input',
        type: 'text',
        name: 'title',
        placeholder: '*Title',
        label: 'Title:',
        required: true,
      },
      {
        tag: 'textarea',
        type: '',
        name: 'text',
        placeholder: '*Text',
        label: 'Text:',
        required: false,
      },
      {
        tag: 'input',
        type: 'text',
        name: 'created_by',
        placeholder: '*Created by',
        label: 'Created by:',
        required: true,
      },
      {
        tag: 'input',
        type: 'text',
        name: 'assigned_to',
        placeholder: 'Assigned to',
        label: 'Assigned to:',
        required: false,
      },
      {
        tag: 'input',
        type: 'text',
        name: 'status_text',
        placeholder: 'Status text',
        label: 'Status text:',
        required: false,
      },
    ],
    updateFields = [
      {
        tag: 'select',
        type: '',
        name: 'open',
        placeholder: '',
        label: 'Open/closed:',
        required: false,
      },
      {
        tag: 'input',
        type: 'date',
        name: 'created_on',
        placeholder: 'Created on',
        label: 'Created on:',
        required: false,
      },
      {
        tag: 'input',
        type: 'date',
        name: 'last_updated',
        placeholder: 'Last updated on',
        label: 'Last updated on:',
        required: false,
      },
    ],
    getIssuesProject = useRef(null),
    projectNameOwner = useRef(null),
    issueFilters = useRef(null),
    submitIssueFields = useRef(null),
    updateIssueFieldset = useRef(null),
    updateIssueForm = useRef(null),
    deleteIssueFieldset = useRef(null),
    [data, setData] = useState(
      JSON.stringify(
        { message: 'submit a form to see its result here' },
        null,
        2
      )
    ),
    [issueToUpdate, setIssueToUpdate] = useState({})

  return (
    <main>
      <section>
        <h3 className={styles.title}>Example GET Usage</h3>
        <code>/api/issues/&#123;project&#125;</code>
        <br />
        <code>
          /api/issues/&#123;project&#125;?open=true&amp;assigned_to=Joe
        </code>
        <h3 className={styles.title}>Example Return</h3>
        <pre>
          <code>
            {/* Should map through an array or object, instead of adding html properties manually. */}
            [<br />
            {'  '}&#123;
            <br />
            {'    '}&quot;_id&quot;: &quot;5871dda29faedc3491ff93bb&quot;,
            <br />
            {'    '}&quot;issue_title&quot;: &quot;Fix error in posting
            data&quot;,
            <br />
            {'    '}&quot;issue_text&quot;: &quot;When we post data it has an
            error.&quot;,
            <br />
            {'    '}&quot;created_on&quot;:
            &quot;2017-01-08T06:35:14.240Z&quot;,
            <br />
            {'    '}&quot;updated_on&quot;:
            &quot;2017-01-08T06:35:14.240Z&quot;,
            <br />
            {'    '}&quot;created_by&quot;: &quot;Joe&quot;,
            <br />
            {'    '}&quot;assigned_to&quot;: &quot;Joe&quot;,
            <br />
            {'    '}&quot;open&quot;: true,
            <br />
            {'    '}&quot;status_text&quot;: &quot;In QA&quot;,
            <br />
            {'  '}&#125;,
            <br />
            {'  '}...
            <br />]
          </code>
        </pre>
      </section>

      <hr />

      <section>
        <h2 className={styles.title}>API Tests</h2>

        <p>Asterisks (*) denote required fields.</p>

        <h3 className={styles.title}>Get Projects</h3>
        <form className={styles.form} id='getProjects' onSubmit={getProjects}>
          <button type='submit'>Get Projects</button>
        </form>

        <h3 className={styles.title}>Get Issues</h3>
        <form className={styles.form} onSubmit={getIssues}>
          <input
            ref={getIssuesProject}
            type='text'
            placeholder="*Name of issues' project"
            required
          />
          <br />
          <h4 className={styles['filters-title']}>Issue Filters</h4>
          <fieldset
            ref={issueFilters}
            className={`${styles.fieldset} ${styles['flex-grid']}`}
          >
            {[...submitFields, ...updateFields].map(
              ({ tag, type, name, placeholder, label }, i) => (
                <label key={i}>
                  {label}
                  <br />
                  {tag === 'select' ? (
                    <select
                      className={styles['issue-filter']}
                      name={name}
                      title={name}
                    >
                      <option value=''>Open?</option>
                      <option value='true'>Open</option>
                      <option value='false'>Closed</option>
                    </select>
                  ) : type === 'number' ? (
                    <input
                      type={type}
                      name={name}
                      className={styles['issue-filter']}
                      min='0'
                      step='1'
                      placeholder={placeholder}
                    />
                  ) : tag === 'textarea' ? (
                    <textarea
                      form='getIssues'
                      name={name}
                      className={styles['issue-filter']}
                      placeholder={placeholder.slice(1, placeholder.length)}
                      maxLength={50}
                    />
                  ) : type === 'date' ? (
                    <input
                      type={type}
                      name={name}
                      className={styles['issue-filter']}
                    />
                  ) : (
                    <input
                      type='text'
                      name={name}
                      className={styles['issue-filter']}
                      title={
                        placeholder.startsWith('*')
                          ? placeholder.slice(1, placeholder.length)
                          : placeholder
                      }
                      placeholder={
                        placeholder.startsWith('*')
                          ? placeholder.slice(1, placeholder.length)
                          : placeholder
                      }
                      maxLength={50}
                    />
                  )}
                </label>
              )
            )}
          </fieldset>
          <button className={styles.button} type='reset'>
            Reset
          </button>
          <button className={styles.button} type='submit'>
            Get Project Issues
          </button>
        </form>

        <h3 className={styles.title}>Submit Issue</h3>
        <form className={styles.form} onSubmit={submitIssue}>
          <fieldset
            ref={projectNameOwner}
            className={`${styles.fieldset} ${styles['flex-row']} ${styles['submit-project']}`}
          >
            <label>
              Project Name:
              <br />
              <input
                type='text'
                placeholder='*Project to post issue to'
                required
              />
            </label>
            <label>
              Project Owner (if new project):
              <br />
              <input type='text' placeholder='Project owner (if new project)' />
            </label>
          </fieldset>
          <fieldset
            ref={submitIssueFields}
            className={`${styles.fieldset} ${styles['flex-grid']}`}
          >
            {submitFields.map(
              ({ tag, type, name, placeholder, label, required }, i) => (
                <label className={styles.label} key={i}>
                  {label}
                  <br />
                  {tag === 'textarea' ? (
                    <textarea
                      name={name}
                      placeholder={placeholder}
                      required={required}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      required={required}
                    />
                  )}
                </label>
              )
            )}
          </fieldset>
          <button type='reset'>Reset</button>
          <button type='submit'>Submit Issue</button>
        </form>

        <h3 className={styles.title}>Update Issue</h3>
        {/* @ts-ignore */}
        <form className={styles.form} onSubmit={fetchIssueToUpdate}>
          <fieldset
            ref={updateIssueFieldset}
            className={`${styles.fieldset} ${styles['flex-grid']}`}
          >
            <label>
              Project Of Issue To Update
              <br />
              <input
                type='text'
                name='project'
                placeholder='*Project'
                title='Project Title'
                required
              />
            </label>
            <label>
              Index Of Issue To Update
              <br />
              <input
                type='number'
                min='0'
                step='1'
                name='issue-name'
                placeholder='*Issue index'
                title='Issue Index'
                required
              />
            </label>
          </fieldset>
          <button type='submit'>Fetch Issue To Update</button>
        </form>

        <div
          className={
            Object.keys(issueToUpdate).length === 0 ? styles.hidden : ''
          }
        >
          <h4>Issue Fields to Update</h4>
          <form className={styles.form} onSubmit={updateIssue}>
            <fieldset
              ref={updateIssueForm}
              className={`${styles.fieldset} ${styles['flex-grid']}`}
            >
              <label>
                Title:
                <br />
                <input
                  type='text'
                  name='new-title'
                  placeholder='title'
                  // @ts-ignore
                  defaultValue={issueToUpdate.title || ''}
                  required
                />
              </label>
              <label>
                Text:
                <br />
                <textarea
                  name='new-text'
                  placeholder='Text'
                  // @ts-ignore
                  defaultValue={issueToUpdate.text || ''}
                />
              </label>
              <label>
                Assigned To:
                <br />
                <input
                  type='text'
                  name='new-assigned-to'
                  placeholder='Assigned to'
                  defaultValue={issueToUpdate['assigned_to'] || ''}
                />
              </label>
              <label>
                Status Text:
                <br />
                <input
                  type='text'
                  name='new-status-text'
                  placeholder='Status text'
                  defaultValue={issueToUpdate['status_text'] || ''}
                />
              </label>
              <label>
                Open:
                <br />
                {/* @ts-ignore */}
                {issueToUpdate.open === true && (
                  <input type='checkbox' name='new-open' defaultChecked />
                )}
                {/* @ts-ignore */}
                {issueToUpdate.open !== true && (
                  <input type='checkbox' name='new-open' />
                )}{' '}
                Open
              </label>
            </fieldset>
            <button type='submit'>Update Issue</button>
          </form>
          <br />
        </div>

        <h3 className={styles.title}>Delete Issue</h3>
        <form className={styles.form} onSubmit={deleteIssue}>
          <fieldset
            ref={deleteIssueFieldset}
            className={`${styles.fieldset} ${styles['flex-grid']}`}
          >
            <label>
              Project Of Issue To Delete:
              <br />
              <input
                type='text'
                maxLength={50}
                placeholder='*project'
                required
              />
            </label>
            <label>
              Index Of Issue To Delete
              <br />
              <input
                type='number'
                min={0}
                step={1}
                placeholder='*issue index'
                required
              />
            </label>
          </fieldset>
          <button type='submit'>Delete Issue</button>
        </form>

        <code>{data}</code>
      </section>
    </main>
  )
}
