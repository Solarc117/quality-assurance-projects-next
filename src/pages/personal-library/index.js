import React from 'react'
import Header from '../../modules/general/header-component.js'
import Library from '../../modules/personal-library/library-component.js'
import Footer from '../../modules/general/footer-component.js'

export default function LibraryPage() {
  return (
    <>
      <Header currentPath='/personal-library' />
      <Library />
      <Footer />
    </>
  )
}
