export type CustomProductFields = {
  cutTokensPerCut?: { value: string }
  handlingTokens?: { value: string }
  stockingUnit?: { value: string }
  cutWaste?: { value: string }
}

export type Form = {
  numberOfPieces: number
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
  product: { title: string; handle: string }
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
