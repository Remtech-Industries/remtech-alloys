import { Form, Product, Variant } from './types'

type PricingTable = {
  id: number
  title: string
  each: string
  quantity: number
  price: string
}

type Params = {
  form: Form
  selectedVariant: Variant
  cutFee: Product
}

export const pricingTable = (i: Params): PricingTable[] => {
  const { form, selectedVariant, cutFee } = i
  const { quantity, quantityState, length, lengthState } = form

  const currency = (number: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(number)
  }

  const toInches = (number: number) => {
    return Math.floor((number / 25.4) * 1000) / 1000
  }

  // handling fee
  const showHandlingFee = quantity > 0
  const handlingFee = {
    id: 1,
    title: 'Handling Fee',
    each: currency(5),
    quantity: 1,
    price: currency(5),
  }

  // product
  const showProduct = quantityState && lengthState
  const product = {
    id: 2,
    quantity: +quantity,
    each: currency((selectedVariant.price * +length) / 100),
    title: `${Math.floor(+length)}mm/${toInches(+length)} inches`,
    price: currency((selectedVariant.price * +quantity * +length) / 100),
  }

  // cut fee
  const showCutFee = quantity > 0
  const cutFeeObject = {
    id: 3,
    quantity: +quantity,
    each: currency(cutFee?.price / 100),
    title: 'Cut Fee',
    price: currency((+quantity * cutFee?.price) / 100),
  }

  const tableRows = []
  if (showHandlingFee) tableRows.push(handlingFee)
  if (showProduct) tableRows.push(product)
  if (showCutFee) tableRows.push(cutFeeObject)

  // sort by id
  return tableRows.sort((a, b) => a.id - b.id)
}
