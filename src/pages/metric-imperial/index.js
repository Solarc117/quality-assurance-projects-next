import React from 'react'
import Header from '../../modules/general/header-component.js'
import MetricImperial from '../../modules/metric-imperial/convert-component.js'
import Footer from '../../modules/general/footer-component.js'

export default function MetricImperialPage() {
  return (
    <>
      <Header currentPath='/metric-imperial' />
      <hr />
      <MetricImperial />
      <hr />
      <Footer />
    </>
  )
}
