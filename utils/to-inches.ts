type Unit = 'mm'

export function toInches(number: number, unit: Unit, roundIt?: 'roundIt') {
  let result = number
  if (unit === 'mm') result = number / 25.4

  if (!roundIt) return result
  return Math.round(result * 1000) / 1000
}
