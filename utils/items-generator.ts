import { formatMoney } from '@/utils/format-money'
import type { Addons, Form, Variant } from '@/utils/types'
interface VariantWithProductTitle extends Variant {
  productTitle: string
}

export type Item = {
  id: string
  title: string
  each: string
  quantity: number
  price: string
}

export function itemsGenerator(
  form: Form,
  selectedVariant: VariantWithProductTitle,
  addons: Addons
) {
  // handling fee
  const handlingFeeCost = +addons.handling_fee.price.amount
  const handlingFeeRow = {
    id: addons.handling_fee.id,
    title: 'Handling Fee',
    each: formatMoney(handlingFeeCost),
    quantity: form.quantity,
    price: formatMoney(handlingFeeCost * form.quantity),
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  }

  // product variant
  const productVariantRow = {
    id: selectedVariant.id,
    title: selectedVariant.productTitle,
    each: formatMoney(+selectedVariant.priceV2.amount * form.length),
    quantity: form.quantity,
    price: formatMoney(
      +selectedVariant.priceV2.amount * form.length * form.quantity
    ),
  }

  // cut fee
  let cutFeeQuantity = form.quantity
  if (form.length * form.quantity === selectedVariant.quantityAvailable) {
    cutFeeQuantity--
  }
  const cutFeeCost = +addons.cut_fee.price.amount
  const cutFeeRow = {
    id: addons.cut_fee.id,
    title: 'Cut Fee',
    each: formatMoney(cutFeeCost),
    quantity: cutFeeQuantity,
    price: formatMoney(cutFeeCost * cutFeeQuantity),
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  }

  return [handlingFeeRow, productVariantRow, cutFeeRow].filter(
    (row) => row.quantity > 0
  )
}
