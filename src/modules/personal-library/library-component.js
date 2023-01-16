import React, { useState, useRef } from 'react'

export default function Library() {
  async function submitBook(event) {
    event.preventDefault()

    // @ts-ignore
    const book = new URLSearchParams(new FormData(newBookForm.current))

    let result
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        body: book,
      })
      result = await response.json()
    } catch (error) {
      alert('could not post book - please try again')
      console.error(error)
    }

    // Might do something with the result object, or might just fetch all books and display them further down the page.
  }
  function deleteAll(event) {
    event.preventDefault()
  }
  const [sampleBook_Id, setSampleBook_Id] = useState(''),
    newBookForm = useRef(null)

  return (
    <main>
      <section id='sampleposting'>
        <h2>Test API responses</h2>
        <form action='/api/books' method='post' className='border'>
          <h4>Test post to /api/books</h4>
          <label>
            Book Title
            <input type='text' name='title' />
          </label>
          <br />
          <button type='submit'>Post book</button>
        </form>
        <form
          action={`/api/books/${sampleBook_Id}`}
          method='post'
          className='border'
        >
          <h4>Test post to /api/books/:_id</h4>
          <label>
            Id of book to comment on
            <input
              type='text'
              value={sampleBook_Id}
              onChange={({ target: { value } }) => setSampleBook_Id(value)}
            />
          </label>
          <br />
          <label>
            Comment
            <input type='text' name='comment' />
          </label>
          <br />
          <button type='submit'>Post comment</button>
        </form>
      </section>
      <hr />
      <section id='sampleui'>
        <h2>Sample Front-End</h2>
        <form
          ref={newBookForm}
          onSubmit={submitBook}
          id='newBookForm'
          className='border'
        >
          <label>
            New Book Title
            <input type='text' name='title' placeholder='Moby Dick' />
          </label>
          <button type='submit' value='Submit' id='newBook'>
            Submit New Book!
          </button>
        </form>
        <div id='display' />
        <div id='bookDetail' className='border'>
          <p id='detailTitle'>Select a book to see its details and comments</p>
          <ol id='detailComments'></ol>
        </div>
        <button type='submit' onSubmit={deleteAll} value='Delete all books' />
      </section>
    </main>
  )
}
