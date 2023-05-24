import { describe, it, expect } from 'vitest'
import { toPricePerInch } from './to-price-per-inch'

describe('toPricePerInch', () => {
  describe('when unit is mm', () => {
    it('converts a number from mm to price per inch', () => {
      expect(toPricePerInch(1.0, 'mm')).toBe(25.4)
    })
  })
})
