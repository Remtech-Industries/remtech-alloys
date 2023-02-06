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
  quantity?: number | string | null
  quantityState?: boolean
  length?: number | string | null
  lengthState?: boolean
}

export type CartLine = {
  quantity: number
  merchandiseId: string
}

export type Cart = {
  id?: string
  checkoutUrl?: string
  lines?: {
    edges: CartLine[]
  }
}
