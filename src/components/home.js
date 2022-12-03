// @ts-nocheck
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <p>
        My take on the final projects from the{' '}
        <Link
          target='_blank'
          rel='noreferrer'
          href='https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/'
        >
          Quality Assurance Unit
        </Link>
        .
      </p>
      <p>
        From the{' '}
        <Link
          target='_blank'
          rel='noreferrer'
          href='https://www.freecodecamp.org'
        >
          freeCodeCamp
        </Link>{' '}
        curriculum.
      </p>
    </main>
  )
}
