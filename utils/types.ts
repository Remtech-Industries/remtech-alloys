export type Product = {
  id: string
  handle: string
  priceRange: { maxVariantPrice: Price; minVariantPrice: Price }
  title: string
  cutFee?: { value: string }
  handlingFee?: { value: string }
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
  attributes: { key: string; value: string }[]
}

export type Attribute = {
  key: string
  value: string
}

export type Merchandise = {
  id: string
  title: string
  image?: { url: string; altText: string }
  product: { title: string }
  addonType: {
    value: string | null
  }
}

export type CartLine = {
  id: string
  quantity: number
  merchandise: Merchandise
  cost: {
    totalAmount: Price
  }
  attributes: Attribute[]
}

export type CartLineInput = {
  quantity: number
  merchandiseId: string
  attributes: Attribute[]
}

// other
export type Price = {
  amount: string
  currencyCode: string
}

export type MetafieldVariant = {
  id: string
  title: string
  price: Price
  addonType: { value: string }
}

export type Addons = {
  cut_fee: MetafieldVariant
  handling_fee: MetafieldVariant
}
