import type { Attribute } from '@/utils/types'
import type { ProductVariant } from './storefront-api-types'
interface VariantWithProduct extends ProductVariant {
  absoluteLength: number
  actualLengthPerPiece: number
  cutWaste: number
  cutTokensPerCut?: string
  numberOfPieces: number
  pricePerCutToken: string
  productTitle: string
  requestedLength: number
}

export type Item = {
  id: string
  title: string
  cartQuantity: number
  requestedLength?: number
  pricePerPiece: number
  linePrice: number
  displayedQuantity: number
  attributes: Attribute[]
}

export function itemsGenerator(selectedVariant: VariantWithProduct) {
  const {
    absoluteLength,
    actualLengthPerPiece,
    cutTokensPerCut = 0,
    numberOfPieces,
    pricePerCutToken,
    productTitle,
    requestedLength,
  } = selectedVariant

  // product variant
  const pricePerStockingUnit = +selectedVariant.price.amount

  const productVariantRow: Item = {
    id: selectedVariant.id,
    title: productTitle,
    cartQuantity: absoluteLength,
    requestedLength: requestedLength,
    pricePerPiece: actualLengthPerPiece * pricePerStockingUnit,
    linePrice: absoluteLength * pricePerStockingUnit,
    displayedQuantity: numberOfPieces,
    attributes: [
      {
        key: 'Pieces',
        value: `${numberOfPieces} pcs @ ${requestedLength / 25.4} inches/ea.`,
      },
    ],
  }

  // handling fee
  const handlingFeePrice = 0
  const handlingFeeRow: Item = {
    id: 'a',
    title: 'Handling Fee',
    cartQuantity: numberOfPieces > 0 ? 1 : 0,
    pricePerPiece: handlingFeePrice,
    linePrice: handlingFeePrice,
    displayedQuantity: 1,
    attributes: [],
  }

  // cut fee
  const cutPricePerPiece = +pricePerCutToken * +cutTokensPerCut
  const cutFeeRow: Item = {
    id: 'b',
    title: 'Cut Cost',
    cartQuantity: numberOfPieces * +cutTokensPerCut,
    pricePerPiece: cutPricePerPiece,
    linePrice: numberOfPieces * cutPricePerPiece,
    displayedQuantity: numberOfPieces,
    attributes: [],
  }

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    ({ cartQuantity }) => cartQuantity > 0
  )
}
