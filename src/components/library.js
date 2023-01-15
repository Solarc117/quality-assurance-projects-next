import React, { useState } from 'react'

export default function Library() {
  function deleteAll(event) {
    event.preventDefault()
  }
  const [sampleBook_Id, setSampleBook_Id] = useState('')

  return (
    <main>
      <div id='sampleposting'>
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
        <form action={`/api/books/${sampleBook_Id}`} method='post' className='border'>
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
      </div>
      <hr />
      <div id='sampleui'>
        <h2>Sample Front-End</h2>
        <form id='newBookForm' className='border'>
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
      </div>
    </main>
  )
}
