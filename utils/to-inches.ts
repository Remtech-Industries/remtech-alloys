type Unit = 'mm'

export function toInches(number: number, unit: Unit) {
  let result = number
  if (unit === 'mm') result = number / 25.4
  return Math.round(result * 1000) / 1000
}
