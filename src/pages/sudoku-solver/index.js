import React from 'react'
import Header from '../../components/header'
import Sudoku from '../../components/sudoku'
import Footer from '../../components/footer'

export default function SudokuPage() {
  return (
    <>
      <Header currentPath='/sudoku-solver' />
      <hr />
      <Sudoku />
      <hr />
      <Footer />
    </>
  )
}
