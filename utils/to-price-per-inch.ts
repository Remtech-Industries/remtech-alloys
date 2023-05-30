import { mmInInch } from './constants'

export function toPricePerInch(price: number, unit: 'mm') {
  if (unit === 'mm') return price * mmInInch
  return price
}
