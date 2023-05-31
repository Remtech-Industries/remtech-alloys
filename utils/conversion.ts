import { mmInInch } from './constants'

export function toInches(number: number, unit: 'mm', roundIt?: 'roundIt') {
  let result = number
  if (unit === 'mm') result = number / mmInInch

  if (!roundIt) return result
  return Math.round(result * 1000) / 1000
}

export function toMm(number: number, unit: 'inch') {
  if (unit === 'inch') return number * mmInInch
  return number
}

export function toPricePerInch(price: number, unit: 'mm') {
  if (unit === 'mm') return price * mmInInch
  return price
}

export function toMoney(number: number) {
  // TODO?: support other currencies
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(number)
}
