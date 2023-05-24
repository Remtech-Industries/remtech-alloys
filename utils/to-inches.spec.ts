import { it, describe, expect } from 'vitest'
import { toInches } from './to-inches'

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
