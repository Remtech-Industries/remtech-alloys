export type Price = {
  amount: string
  currencyCode: string
}

export type Product = {
  id: string
  handle: string
  priceRange: { maxVariantPrice: Price; minVariantPrice: Price }
  title: string
  totalInventory: number
  variants: Variant[]
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

export type CartLine = {
  id: string
  quantity: number
  merchandiseId: string
  merchandise: Product
  cost: {
    totalAmount: Price
  }
}

export type Cart = {
  id: string
  checkoutUrl?: string
  lines?: {
    edges: {
      node: CartLine
    }[]
  }
}
