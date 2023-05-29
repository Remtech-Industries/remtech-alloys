import { mmInInch } from './constants'

type Unit = 'inch'

export function toMm(number: number, unit: Unit) {
  if (unit === 'inch') return number * mmInInch
  return number
}
