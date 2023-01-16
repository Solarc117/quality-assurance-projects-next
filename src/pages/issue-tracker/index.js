import React from 'react'
import Header from '../../modules/general/header-component.js'
import Issue from '../../modules/issue-tracker/issue-component.js'
import Footer from '../../modules/general/footer-component.js'

export default function IssuesPage() {
  return (
    <>
      <Header currentPath='/issue-tracker' />
      <hr />
      <Issue />
      <hr />
      <Footer />
    </>
  )
}
