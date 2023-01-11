import React from 'react'
import Header from '../../components/header'
import Library from '../../components/library'
import Footer from '../../components/footer'

export default function LibraryPage() {
  return (
    <>
      <Header currentPath='/personal-library' />
      <Library />
      <Footer />
    </>
  )
}
