export type Product = {
  id: string
  handle: string
  priceRange: { maxVariantPrice: Price; minVariantPrice: Price }
  title: string
  cutFee?: { value: string }
  stockingUnit?: { value: string }
  totalInventory: number
  variants: { edges: { node: Variant }[] }
}

export type Variant = {
  id: string
  title: string
  quantityAvailable: number
  priceV2: Price
}

export type Form = {
  quantity: number
  quantityIsValid: boolean
  length: number
  lengthIsValid: boolean
}

// cart
export type Cart = {
  id: string
  checkoutUrl: string
  lines: {
    edges: {
      node: CartLine
    }[]
  }
}

export type CartLine = {
  id: string
  quantity: number
  merchandiseId: string
  merchandise: Product
  cost: {
    totalAmount: Price
  }
}

export type CartLineInput = {
  quantity: number
  merchandiseId: string
}

// other
export type Price = {
  amount: string
  currencyCode: string
}
