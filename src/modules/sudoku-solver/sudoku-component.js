import React, { useState } from 'react'
import styles from '../../../styles/Sudoku.module.css'

export default function Sudoku() {
  async function check(event) {
    event.preventDefault()
    const data = await fetch('/api/sudoku/check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          sudoku,
          coordinate,
          value: coordValue,
        }),
      }),
      parsed = await data.json()

    setResponse(JSON.stringify(parsed, null, 2))
  }
  async function solve(event) {
    event.preventDefault()
    const data = await fetch('/api/sudoku/solve', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ sudoku }),
      }),
      parsed = await data.json(),
      { solution } = parsed

    setResponse(JSON.stringify(parsed, null, 2))
    if (typeof solution === 'string') setSudoku(solution)
  }
  const [response, setResponse] = useState('{}'),
    [sudoku, setSudoku] = useState(
      '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
    ),
    [coordinate, setCoordinate] = useState(''),
    [coordValue, setCoordValue] = useState(''),
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    columns = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <main>
      <div className={styles.container}>
        <div className={styles['form-container']}>
          <form id='solve-form'>
            <textarea
              rows={10}
              cols={85}
              id='text-input'
              className={styles['text-input']}
              name='sudoku'
              value={sudoku}
              onChange={({ target: { value } }) => setSudoku(value)}
            ></textarea>
            <br />
            <input
              type='submit'
              value='Solve'
              id='solve-button'
              onClick={solve}
            />
          </form>
          <form id='check-form'>
            <p>
              Coordinate (A1):
              <input
                id='coord'
                className={styles.checker}
                type='text'
                name='coordinate'
                value={coordinate}
                onChange={({ target: { value } }) => setCoordinate(value)}
              />
            </p>
            <p>
              Value (1-9):
              <input
                className={styles.checker}
                type='text'
                id='val'
                name='value'
                value={coordValue}
                onChange={({ target: { value } }) => setCoordValue(value)}
              />
            </p>
            <input
              type='submit'
              value='Check Placement'
              id='check-button'
              onClick={check}
            />
          </form>
          <span id='json' className={styles.json}>
            <code>{response}</code>
          </span>
        </div>

        <div className={styles['sudoku-grid-container']}>
          <table className={styles.yAxisLegend}>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className={styles.row}>{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles['sudoku-grid']}>
            <table className={styles.xAxisLegend}>
              <tbody>
                <tr>
                  {columns.map((column, i) => (
                    <td key={i} className={styles.column}>
                      {column}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <table className={styles.grid}>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map(column => {
                      const id = row + column,
                        a = (row.charCodeAt(0) - 65) * 9,
                        b = column - 1,
                        index = a + b

                      return (
                        <td
                          key={id}
                          id={id}
                          title={id}
                          className={`${styles['sudoku-input']} ${
                            row.match(/[CFI]/g) || column % 3 === 0
                              ? styles[id]
                              : ''
                          }`}
                        >
                          {sudoku[index] === '.' ? '' : sudoku[index]}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
