import Converter from './converter.js'

export default class ConvertHandler {
  /**
   * @param {string} input
   * @returns {{ err: string } | { initNum: number, initUnit: string, returnNum: number, returnUnit: string, string: string }}
   */
  static convert(input) {
    // Would be better to wrap Converter methods in a try/catch block, & instead of returning an error property, throwing an error. This would interrupt further Converter code from running, which is what we want if an error is returned.
    const { err: err0, initNum } = Converter.getNum(input),
      { err: err1, initUnit } = Converter.getUnit(input),
      // @ts-ignore
      { err: err2, returnUnit } = Converter.getReturnUnit(initUnit),
      // @ts-ignore
      { err: err3, returnNum } = Converter.getReturnNum(initNum, initUnit),
      // @ts-ignore
      string = Converter.getString(initNum, initUnit, returnNum, returnUnit),
      errs = [err0, err1, err2, err3]

    for (const err of errs) if (err) return { err }

    return {
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string,
    }
  }
}
