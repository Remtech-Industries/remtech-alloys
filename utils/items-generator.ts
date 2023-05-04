import { formatMoney } from '@/utils/format-money'
import type { Addons, Attribute, Form, Variant } from '@/utils/types'
interface VariantWithProductTitle extends Variant {
  productTitle: string
}

export type Item = {
  id: string
  title: string
  each: string
  quantity: number
  price: string
  numberPrice: number
  attributes: Attribute[]
  length?: number
}

const asItem = (item: Item) => item

export function itemsGenerator(
  form: Form,
  selectedVariant: VariantWithProductTitle,
  addons: Addons
) {

  // product variant
  const productVariantPrice =
    +selectedVariant.priceV2.amount * form.length * form.quantity
  const productVariantRow = asItem({
    id: selectedVariant.id,
    title: selectedVariant.productTitle,
    each: formatMoney(+selectedVariant.priceV2.amount * form.length),
    quantity: form.quantity,
    length: form.length,
    price: formatMoney(productVariantPrice),
    numberPrice: productVariantPrice,
    attributes: [
      {key: 'Pieces', value: `${form.quantity} pcs @ ${form.length / 25.4}/ea.`},
    ],
  })

  // handling fee
  const handlingFeePrice = +addons.handling_fee.price.amount
  const handlingFeeRow = asItem({
    id: addons.handling_fee.id,
    title: 'Handling Fee',
    each: formatMoney(handlingFeePrice),
    quantity: form.quantity > 0 ? 1 : 0,
    price: formatMoney(handlingFeePrice),
    numberPrice: handlingFeePrice,
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  })

  // cut fee
  let cutFeeQuantity = form.quantity
  if (form.length * form.quantity === selectedVariant.quantityAvailable) {
    cutFeeQuantity--
  }
  const cutFeeCost = +addons.cut_fee.price.amount
  const cutFeePrice = cutFeeCost * cutFeeQuantity
  const cutFeeRow = asItem({
    id: addons.cut_fee.id,
    title: 'Cut Fee',
    each: formatMoney(cutFeeCost),
    quantity: cutFeeQuantity,
    price: formatMoney(cutFeePrice),
    numberPrice: cutFeePrice,
    attributes: [{ key: '_parent_id', value: selectedVariant.id }],
  })

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    ({quantity}) => quantity > 0
  )
}
