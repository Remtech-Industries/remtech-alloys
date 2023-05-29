import { toInches } from '@/utils/to-inches'
import type { Attribute } from '@/utils/types'

interface Input {
  absoluteLength: number
  actualLengthPerPiece: number
  cutTokenId: string
  cutTokensPerCut: number
  handlingTokenId: string
  numberOfHandlingTokens: number
  numberOfPieces: number
  pricePerCutToken: number
  pricePerHandlingToken: number
  pricePerStockingUnit: number
  productTitle: string
  requestedLength: number
  selectedVariantId: string
}

export type Item = {
  attributes: Attribute[]
  cartQuantity: number
  displayedQuantity: number
  id: string
  linePrice: number
  pricePerPiece: number
  requestedLength?: number
  title: string
}

export function itemsGenerator(input: Input) {
  const {
    absoluteLength,
    actualLengthPerPiece,
    cutTokenId,
    cutTokensPerCut,
    handlingTokenId,
    numberOfHandlingTokens,
    numberOfPieces,
    pricePerCutToken,
    pricePerHandlingToken,
    pricePerStockingUnit,
    productTitle,
    requestedLength,
    selectedVariantId,
  } = input

  // product variant
  const productVariantRow: Item = {
    id: selectedVariantId,
    title: productTitle,
    cartQuantity: absoluteLength,
    requestedLength: requestedLength,
    pricePerPiece: actualLengthPerPiece * pricePerStockingUnit,
    linePrice: absoluteLength * pricePerStockingUnit,
    displayedQuantity: numberOfPieces,
    attributes: [
      {
        key: 'Pieces',
        value: `${numberOfPieces} pcs @ ${toInches(
          requestedLength,
          'mm',
          'roundIt'
        )} inches/ea. (${absoluteLength}mm)`,
      },
    ],
  }

  // handling fee
  const handlingPrice = pricePerHandlingToken * numberOfHandlingTokens
  const handlingFeeRow: Item = {
    id: handlingTokenId,
    title: 'Handling Cost',
    cartQuantity: numberOfHandlingTokens,
    pricePerPiece: handlingPrice,
    linePrice: handlingPrice,
    displayedQuantity: 1,
    attributes: [],
  }

  // cut fee
  const cutPricePerPiece = pricePerCutToken * cutTokensPerCut
  const cutFeeRow: Item = {
    id: cutTokenId,
    title: 'Cut Cost',
    cartQuantity: numberOfPieces * cutTokensPerCut,
    pricePerPiece: cutPricePerPiece,
    linePrice: numberOfPieces * cutPricePerPiece,
    displayedQuantity: numberOfPieces,
    attributes: [],
  }

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    ({ cartQuantity }) => cartQuantity > 0
  )
}
