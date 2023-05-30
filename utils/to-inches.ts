import { mmInInch } from './constants'
type Unit = 'mm'

export function toInches(number: number, unit: Unit, roundIt?: 'roundIt') {
  let result = number
  if (unit === 'mm') result = number / mmInInch

  if (!roundIt) return result
  return Math.round(result * 1000) / 1000
}
