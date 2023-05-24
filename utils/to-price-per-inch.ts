import { mmInInch } from './constants'

export function toPricePerInch(price: number, unit: 'mm') {
  let result = price
  if (unit === 'mm') result = price * mmInInch
  return result
}
