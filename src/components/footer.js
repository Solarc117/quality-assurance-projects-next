// @ts-nocheck
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <ul>
        <li>By Carlos Bernal.</li>
        <li>
          <Link
            target='_blank'
            rel='noreferrer'
            href='https://www.linkedin.com/in/carlos-jonathan-bernal-torres-07b90a1b1/'
          >
            My LinkedIn
          </Link>
          .
        </li>
        <li>
          <Link
            target='_blank'
            rel='noreferrer'
            href='https://github.com/Solarc117'
          >
            My Github
          </Link>
          .
        </li>
        <li>
          <Link
            target='_blank'
            rel='noreferrer'
            href='https://www.freecodecamp.org/solarc'
          >
            My freeCodeCamp
          </Link>
          .
        </li>
      </ul>
    </footer>
  )
}
