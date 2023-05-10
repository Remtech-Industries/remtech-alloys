import { formatMoney } from '@/utils/format-money'
import type { Addons, Attribute, Form, Variant } from '@/utils/types'
interface VariantWithProduct extends Variant {
  productTitle: string
  cutWaste?: number
}

export type Item = {
  id: string
  title: string
  cartQuantity: number
  pricePerPiece: number
  linePrice: number
  displayedQuantity: number
  attributes: Attribute[]
}

export function itemsGenerator(
  form: Form,
  selectedVariant: VariantWithProduct,
  addons: Addons
) {
  const numberOfPieces = form.quantity
  const requestedLength = form.length

  // product variant
  const cutWaste = selectedVariant.cutWaste || 0
  const actualLength = requestedLength + cutWaste
  const pricePerStockingUnit = +selectedVariant.priceV2.amount

  const productVariantRow: Item = {
    id: selectedVariant.id,
    title: selectedVariant.productTitle,
    cartQuantity: numberOfPieces * actualLength,
    pricePerPiece: actualLength * pricePerStockingUnit,
    linePrice: numberOfPieces * actualLength * pricePerStockingUnit,
    displayedQuantity: numberOfPieces,
    attributes: [
      {key: 'Pieces', value: `${numberOfPieces} pcs @ ${requestedLength / 25.4} inches/ea.`},
    ],
  }

  // handling fee
  const handlingFeePrice = +addons.handling_fee.price.amount
  const handlingFeeRow: Item = {
    id: addons.handling_fee.id,
    title: 'Handling Fee',
    cartQuantity: numberOfPieces > 0 ? 1 : 0,
    pricePerPiece: handlingFeePrice,
    linePrice: handlingFeePrice,
    displayedQuantity: 1,
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  }

  // cut fee
  const cutFeeCost = +addons.cut_fee.price.amount
  const cutFeePrice = cutFeeCost * numberOfPieces
  const cutFeeRow: Item = {
    id: addons.cut_fee.id,
    title: 'Cut Fee',
    cartQuantity: numberOfPieces,
    pricePerPiece: cutFeeCost,
    linePrice: cutFeePrice,
    displayedQuantity: numberOfPieces,
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  }

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    ({cartQuantity}) => cartQuantity > 0
  )
}
