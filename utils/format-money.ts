export function useFormatMoney(number: number) {
  // TODO?: support other currencies
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(number)
}
