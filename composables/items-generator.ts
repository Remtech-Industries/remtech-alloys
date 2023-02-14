import { useFormatMoney } from '~~/utils/format-money'
import type { Addons, Form, Variant } from '~~/utils/types'
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

export function useItemsGenerator(
  form: Form,
  selectedVariant: VariantWithProductTitle,
  addons: Addons
) {
  // handling fee
  const handlingFeeCost = +addons.handling_fee.price.amount
  const handlingFeeRow = {
    id: addons.handling_fee.id,
    title: 'Handling Fee',
    each: useFormatMoney(handlingFeeCost),
    quantity: form.quantity,
    price: useFormatMoney(handlingFeeCost * form.quantity),
  }

  // product variant
  const productVariantRow = {
    id: selectedVariant.id,
    title: selectedVariant.productTitle,
    each: useFormatMoney(+selectedVariant.priceV2.amount * form.length),
    quantity: form.quantity,
    price: useFormatMoney(
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
    each: useFormatMoney(cutFeeCost),
    quantity: cutFeeQuantity,
    price: useFormatMoney(cutFeeCost * cutFeeQuantity),
  }

  return [handlingFeeRow, productVariantRow, cutFeeRow].filter(
    (row) => row.quantity > 0
  )
}
