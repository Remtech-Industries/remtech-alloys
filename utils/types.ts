export type Product = {
  id: number
  title: string
  price: number
  variants: Variant[]
}

export type Variant = {
  id: number
  title: string
  price: number
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
