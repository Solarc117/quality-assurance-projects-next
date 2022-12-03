import React from 'react'
import Header from '../components/header.js'
import Home from '../components/home.js'
import Footer from '../components/footer.js'

export default function HomePage() {
  return (
    <>
      <Header currentPath='/' />
      <hr />
      <Home />
      <hr />
      <Footer />
    </>
  )
}
