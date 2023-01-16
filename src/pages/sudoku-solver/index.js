import React from 'react'
import Header from '../../modules/general/header-component'
import Sudoku from '../../modules/sudoku-solver/sudoku-component'
import Footer from '../../modules/general/footer-component'

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
