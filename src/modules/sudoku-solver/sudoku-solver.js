import '../../../types/index.js'

// @ts-ignore
Set.prototype.copy = function () {
  const set = new Set()

  for (const value of this) set.add(value)

  return set
}

// Credit to Jack He Tech (https://www.youtube.com/watch?v=3_50lwD7ygE); my algorithm is more-or-less his algorithm, except with set implementation for quicker input validation.
export default class SudokuSolver {
  /**
   * @param {Rows} rows
   * @param {ValidNumbers} [rowNumbers]
   * @param {ValidNumbers} [columnNumbers]
   * @param {ValidNumbers} [gridNumbers]
   * @param {number} [emptyCount]
   */
  constructor(rows, rowNumbers, columnNumbers, gridNumbers, emptyCount) {
    this.rows = rows
    const missingProps = {}

    Array.isArray(rowNumbers)
      ? (this.validRowNumbers = rowNumbers)
      : (missingProps.validRowNumbers = this.areaSet())
    Array.isArray(columnNumbers)
      ? (this.validColumnNumbers = columnNumbers)
      : (missingProps.validColumnNumbers = this.areaSet())
    Array.isArray(gridNumbers)
      ? (this.validGridNumbers = gridNumbers)
      : (missingProps.validGridNumbers = this.areaSet())
    typeof emptyCount === 'number'
      ? (this.emptyCount = emptyCount)
      : (missingProps.emptyCount = 0)

    if (Object.keys(missingProps).length > 0) {
      for (const [rowIndex, row] of rows.entries())
        for (const [columnIndex, value] of row.entries()) {
          if (value === '.') {
            if (typeof missingProps.emptyCount === 'number')
              missingProps.emptyCount++
            continue
          }
          const gridIndex = this.gridIndex(rowIndex, columnIndex)

          if (
            (missingProps.validRowNumbers &&
              !missingProps.validRowNumbers[rowIndex].delete(value)) ||
            (missingProps.validColumnNumbers &&
              !missingProps.validColumnNumbers[columnIndex].delete(value)) ||
            (missingProps.validGridNumbers &&
              !missingProps.validGridNumbers[gridIndex].delete(value))
          )
            throw new Error(`invalid sudoku input: duplicate value ${value}`)
        }
      const {
        validRowNumbers,
        validColumnNumbers,
        validGridNumbers,
        emptyCount: eC,
      } = missingProps

      if (validRowNumbers) this.validRowNumbers = validRowNumbers
      if (validColumnNumbers) this.validColumnNumbers = validColumnNumbers
      if (validGridNumbers) this.validGridNumbers = validGridNumbers
      if (typeof eC === 'number') this.emptyCount = eC
    }
  }

  /**
   * @returns {SudokuSolver | null}
   */
  solve() {
    if (this.emptyCount === 0) return this

    const sudokus = this.possibleSudokus()

    return this.search(sudokus)
  }

  /**
   * @param {SudokuSolver[]} sudokus
   * @returns {SudokuSolver | null}
   */
  search(sudokus) {
    if (sudokus.length === 0) return null

    const attempt = sudokus.shift()?.solve()

    return attempt || this.search(sudokus)
  }

  /**
   * @returns {SudokuSolver[]}
   */
  possibleSudokus() {
    const sudokus = []

    // @ts-ignore
    if (this.emptyCount > 0)
      for (const [rowIndex, row] of this.rows.entries())
        for (const [columnIndex, value] of row.entries())
          if (value === '.') {
            const gridIndex = this.gridIndex(rowIndex, columnIndex)
            // @ts-ignore
            for (const number of this.validRowNumbers[rowIndex])
              if (
                // @ts-ignore
                this.validColumnNumbers[columnIndex].has(number) &&
                // @ts-ignore
                this.validGridNumbers[gridIndex].has(number)
              ) {
                const newRows = this.rows.map(row => [...row]),
                  // @ts-ignore
                  newEmptyCount = this.emptyCount - 1,
                  // @ts-ignore
                  validRowNumbersCopy = this.validRowNumbers.map(set =>
                    // @ts-ignore
                    set.copy()
                  ),
                  // @ts-ignore
                  validColumnNumbersCopy = this.validColumnNumbers.map(set =>
                    // @ts-ignore
                    set.copy()
                  ),
                  // @ts-ignore
                  validGridNumbersCopy = this.validGridNumbers.map(set =>
                    // @ts-ignore
                    set.copy()
                  )
                newRows[rowIndex][columnIndex] = number
                validRowNumbersCopy[rowIndex].delete(number)
                validColumnNumbersCopy[columnIndex].delete(number)
                validGridNumbersCopy[gridIndex].delete(number)

                const sudoku = new SudokuSolver(
                  newRows,
                  validRowNumbersCopy,
                  validColumnNumbersCopy,
                  validGridNumbersCopy,
                  newEmptyCount
                )
                sudokus.push(sudoku)
              }

            return sudokus
          }

    return sudokus
  }

  /**
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {string} value
   * @returns {string[]}
   */
  conflicts(rowIndex, columnIndex, value) {
    const gridIndex = this.gridIndex(rowIndex, columnIndex),
      // @ts-ignore
      validRowValues = this.validRowNumbers[rowIndex],
      // @ts-ignore
      validColumnValues = this.validColumnNumbers[columnIndex],
      // @ts-ignore
      validGridValues = this.validGridNumbers[gridIndex],
      conflicts = []

    if (!validRowValues.has(value)) conflicts.push('row')
    if (!validColumnValues.has(value)) conflicts.push('column')
    if (!validGridValues.has(value)) conflicts.push('grid')

    return conflicts
  }

  /**
   * @returns {ValidNumbers}
   */
  areaSet() {
    const values = []

    for (let i = 1; i <= 9; i++) values.push(`${i}`)

    return (
      Array(9)
        // @ts-ignore
        .fill()
        .map(() => new Set(values))
    )
  }

  /**
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @returns {number}
   */
  gridIndex(rowIndex, columnIndex) {
    const f = [0, 1, 2],
      m = [3, 4, 5],
      l = [6, 7, 8],
      possibleGrids = [f, f, f, m, m, m, l, l, l][rowIndex]

    const gridIndex =
      columnIndex <= 2
        ? possibleGrids[0]
        : columnIndex >= 3 && columnIndex <= 5
        ? possibleGrids[1]
        : possibleGrids[2]

    return gridIndex
  }
}
