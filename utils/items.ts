import { Variant, Product, Form } from './types'

type Params = {
  selectedVariant: Variant
  form: Form
  cutFee: Product
}

type Item = {
  quantity: number
  id: number
  properties: { [key: string]: string | number }
}

export const items = (i: Params): Item[] => {
  const { form, selectedVariant, cutFee } = i
  const { quantity, length } = form
  return [
    {
      id: selectedVariant.id,
      quantity: +quantity * +length,
      properties: {
        Order: `form.length form.quantity`,
      },
    },
    {
      id: selectedVariant.id,
      quantity: 6,
      properties: {
        _parent: selectedVariant.id,
      },
    },
    {
      id: cutFee?.variants[0].id,
      quantity: +quantity,
      properties: {
        _parent: selectedVariant.id,
      },
    },
  ]
}
