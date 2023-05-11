type Unit = 'inch'

export function toMm(number: number, unit: Unit) {
  let result = number
  if (unit === 'inch') result = number * 25.4
  return result
}
