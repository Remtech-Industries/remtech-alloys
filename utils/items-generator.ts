import type { Attribute, Form } from '@/utils/types'
import type { ProductVariant } from './storefront-api-types'
interface VariantWithProduct extends ProductVariant {
  productTitle: string
  cutWaste: number
  cutTokensPerCut?: string
  pricePerCutToken: string
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

export function itemsGenerator(
  form: Form,
  selectedVariant: VariantWithProduct
) {
  const { numberOfPieces, length: requestedLength } = form
  const {
    cutWaste = 0,
    productTitle,
    cutTokensPerCut = 0,
    pricePerCutToken,
  } = selectedVariant

  // product variant
  const actualLength = requestedLength + +cutWaste
  const pricePerStockingUnit = +selectedVariant.price.amount

  const productVariantRow: Item = {
    id: selectedVariant.id,
    title: productTitle,
    cartQuantity: numberOfPieces * actualLength,
    requestedLength: requestedLength,
    pricePerPiece: actualLength * pricePerStockingUnit,
    linePrice: numberOfPieces * actualLength * pricePerStockingUnit,
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
  console.log(pricePerCutToken)
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
