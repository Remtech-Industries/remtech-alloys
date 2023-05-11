import { it, expect, describe } from 'vitest'
import { toMm } from './to-mm'

describe('toMm', () => {
  describe('when unit is inch', () => {
    it('converts a number from inches to mm', () => {
      expect(toMm(1, 'inch')).toBe(25.4)
    })
  })
})
