import React, { useRef, useState } from 'react'

export default function MetricImperial() {
  async function handleSubmit(event) {
    event.preventDefault()

    const response = await fetch('/api/convert', {
        method: 'POST',
        body: JSON.stringify({
          // @ts-ignore
          input: inputElement.current.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      data = await response.json()

    setResponseObj(data)
  }
  const inputElement = useRef(),
    [responseObj, setResponseObj] = useState({})

  return (
    <main>
      <h3>Example Usage</h3>
      <br />
      <br />
      <code>/api/convert?input=4gal</code>
      <br />
      <br />
      <code>/api/convert?input=1/2km</code>
      <br />
      <br />
      <code>/api/convert?input=5.4/3lbs</code>
      <br />
      <br />
      <code>/api/convert?input=kg</code>
      <br />
      <br />
      <h3>Example Return</h3>
      <br />
      <br />
      <code>
        &#123;
        <br />
        {'  '}&quot;initNum&quot;: 3.1, <br />
        {'  '}&quot;initUnit&quot;: &quot;mi&quot;,
        <br />
        {'  '}&quot;returnNum&quot;: 4.98895, <br />
        {'  '}&quot;returnUnit&quot;: &quot;km&quot;, <br />
        {'  '}&quot;string&quot;: &quot;3.1 miles converts to 4.98895
        kilometers&quot; <br />
        &#125;
      </code>
      <section className='input'>
        <h3>Front End</h3>
        <form
          id='convert-form'
          className='convert-form border'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            id='convertField'
            name='input'
            // @ts-ignore
            ref={inputElement}
            placeholder='3.1mi'
            required
          />
          <input id='convert' type='submit' value='Convert!' />
        </form>
        <br />
        {/* @ts-ignore */}
        <p className='code'>{responseObj.string || ''}</p>
        <br />
        <code className='json'>{JSON.stringify(responseObj, null, 2)}</code>
      </section>
    </main>
  )
}
