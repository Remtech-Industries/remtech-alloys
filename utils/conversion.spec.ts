import { it, describe, expect } from 'vitest'
import { toInches, toMm, toPricePerInch } from './conversion'

describe('toInches', () => {
  describe('when unit is mm', () => {
    it('converts a number from mm to inches', () => {
      expect(toInches(25.4, 'mm')).toBe(1)
    })

    it('does not round when not requested', () => {
      expect(toInches(1.6, 'mm')).toBe(0.06299212598425198)
    })

    it('rounds down to 3 decimal places when requested', () => {
      expect(toInches(1, 'mm', 'roundIt')).toBe(0.039)
    })

    it('rounds up to 3 decimal places', () => {
      expect(toInches(1.6, 'mm', 'roundIt')).toBe(0.063)
    })
  })
})

describe('toMm', () => {
  describe('when unit is inch', () => {
    it('converts a number from inches to mm', () => {
      expect(toMm(1, 'inch')).toBe(25.4)
    })
  })
})

describe('toPricePerInch', () => {
  describe('when unit is mm', () => {
    it('converts a number from mm to price per inch', () => {
      expect(toPricePerInch(1.0, 'mm')).toBe(25.4)
    })
  })
})
