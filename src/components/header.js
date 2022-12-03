// @ts-nocheck
import Link from 'next/link'

export default function Header({ currentPath }) {
  const pathTitle = [
    ['/', 'Home'],
    ['/metric-imperial', 'Metric-Imperial Converter'],
    ['/issue-tracker', 'Issue Tracker'],
    ['/personal-library', 'Personal Library'],
    ['/sudoku-solver', 'Sudoku Solver'],
    ['/american-british', 'American British Translator'],
  ]

  return (
    <header>
      <h1>Sudoku Solver</h1>
      <nav>
        <ul>
          {pathTitle.map(([path, title], i) => (
            <li key={i} className={currentPath === path ? 'current' : ''}>
              <Link href={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
