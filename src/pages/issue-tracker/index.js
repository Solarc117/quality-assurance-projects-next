import React from 'react'
import Header from '../../components/header'
import Issue from '../../components/issue'
import Footer from '../../components/footer'

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
