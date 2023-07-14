export type CustomProductFields = {
  cutTokensPerCut?: { value: string }
  handlingTokens?: { value: string }
  stockingUnit?: { value: string }
  cutWaste?: { value: string }
}

export type Form = {
  numberOfPieces: number
  quantityIsValid: boolean
  requestedLength: number
  lengthIsValid: boolean
  tagNumber?: string
}

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
