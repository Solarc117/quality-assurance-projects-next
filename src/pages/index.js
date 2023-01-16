import React from 'react'
import Header from '../modules/general/header-component.js'
import Home from '../modules/general/home-component.js'
import Footer from '../modules/general/footer-component.js'

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
