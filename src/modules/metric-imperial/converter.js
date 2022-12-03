export default class Converter {
  static IMP_MET_PAIRS = [
    ['lbs', 'kg'],
    ['mi', 'km'],
    ['gal', 'l'],
  ]
  static LBS_TO_KG = 0.453592
  static MI_TO_KM = 1.60934
  static GAL_TO_L = 3.78541

  /**
   * @description A pure, static method that returns the client's numerical input.
   * @param {string} clientInput Unfiltered input from the client.
   * @returns {{ err: string|null, initNum: number|null }} An object containing either an initNum property representing the numerical value of the client's input in decimal format, or an err property if the input was of an invalid format.
   */
  static getNum(clientInput) {
    const numFracRegex = /^[\d./]+/g,
      matchResult = clientInput.match(numFracRegex),
      numFrac = matchResult ? matchResult[0] : '1',
      divisors = numFrac.match(/\//g)

    if (divisors === null) return { err: null, initNum: +numFrac }

    if (divisors.length > 1)
      return {
        err: 'invalid number format - too many divisors: ' + numFrac,
        initNum: null,
      }

    const [num, denom] = numFrac.split('/').map(v => +v)
    return { err: null, initNum: num / denom }
  }

  /**
   * @description A pure, static method that returns the unit passed by the client, if it is of a valid format (ie. kg, m, mi, etc) and located after the numerical input.
   * @param {string} clientInput Unfiltered input from the client.
   * @returns {{ err: string|null, initUnit: string|null }} An object containing either an initUnit property representing the unit of the client's input, or an err property if the unit is of an invalid format.
   */
  static getUnit(clientInput) {
    const unitRegex = /[a-z]+$/gi,
      matchResult = clientInput.match(unitRegex),
      initUnit = matchResult ? matchResult[0].toLowerCase() : null

    if (
      initUnit === null ||
      !this.IMP_MET_PAIRS.flat().some(unit => unit === initUnit)
    ) {
      return {
        err: `please provide one of the supported units after your numerical input: ${this.IMP_MET_PAIRS.flat().join(
          ', '
        )}`,
        initUnit: null,
      }
    }

    return { err: null, initUnit }
  }

  /**
   * @description A pure, static method that returns the unit that the client's input should be converted to (avoids converting between mass, volume, or length).
   * @param {string} initUnit The return value of this.getUnit with the raw client input as the argument.
   * @returns {{ err: string|null, returnUnit: string|null }} An object containing an error property if the unit passed cannot be converted, or a returnUnit property containing the unit to convert to.
   */
  static getReturnUnit(initUnit) {
    let returnUnit = null

    for (const [imp, met] of this.IMP_MET_PAIRS) {
      if (initUnit === imp) {
        returnUnit = met
        break
      }
      if (initUnit === met) {
        returnUnit = imp
        break
      }
    }

    return {
      err: returnUnit
        ? null
        : `expected ${initUnit} to be one of: ${this.IMP_MET_PAIRS.flat().join(
            ', '
          )}`,
      returnUnit,
    }
  }

  /**
   * @description A pure, static method that accepts a number and a unit, and an optional returnUnit argument (for performance; this.getReturnNum is able to determine the returnUnit via the initUnit & this.getReturnUnit), and returns the number representing the passed quanitiy in the new unit: returnUnit.
   * @param {number} initNum The quantity of initUnit.
   * @param {string} initUnit The unit to convert from.
   * @returns {{ err: string|null, returnNum: number|null }} An object containing an err property of type string or null and a returnNum property of the opposite type, depending on whether the conversion was successful or not.
   */
  static getReturnNum(initNum, initUnit) {
    let returnNum = null

    for (const [ind, [met, imp]] of this.IMP_MET_PAIRS.entries()) {
      const converter =
        ind === 0 ? this.LBS_TO_KG : ind === 1 ? this.MI_TO_KM : this.GAL_TO_L

      if (initUnit === met) {
        returnNum = initNum * converter
        break
      }
      if (initUnit === imp) {
        returnNum = initNum / converter
        break
      }
    }

    return {
      err: returnNum
        ? null
        : `expected ${initUnit} to be one of ${this.IMP_MET_PAIRS.flat().join(
            ', '
          )}`,
      returnNum,
    }
  }

  /**
   * @description A pure static method that returns the fully spelled out version of imperial or metric unit abbreviations.
   * @param {string} unit The unit abbreviation to spell out.
   * @returns {string|null} The full version of the abbreviation, or null if the appreviation was not valid.
   */
  static spellOutUnit(unit) {
    const abbreviations = [
      ['kg', 'kilograms'],
      ['l', 'litres'],
      ['km', 'kilometres'],
      ['lbs', 'pounds'],
      ['gal', 'gallons'],
      ['mi', 'miles'],
    ]

    for (const [abbr, full] of abbreviations) if (unit === abbr) return full

    return null
  }

  /**
   * @description A pure static method that returns a description of the conversion.
   * @param {number} initNum The number to be converted.
   * @param {string} initUnit The abbreviated unit to convert from.
   * @param {number} returnNum The converted number.
   * @param {string} returnUnit The abbreviated unit to convert to.
   * @returns {string|null} A short description of the conversion, or null if the static spellOutUnit method was unable to find the spelling of a unit.
   */
  static getString(initNum, initUnit, returnNum, returnUnit) {
    const [initSpelled, returnSpelled] = [
      this.spellOutUnit(initUnit),
      this.spellOutUnit(returnUnit),
    ]

    return !initSpelled || !returnSpelled
      ? null
      : `${initNum} ${initSpelled} converts to ${returnNum} ${returnSpelled}`
  }
}
