import { computed } from 'vue'
import { useFormatMoney } from '~~/utils/format-money'
import type { Addons, Form, Variant } from '~~/utils/types'
import type { Ref } from 'vue'
interface VariantWithProductTitle extends Variant {
  productTitle: string
}

type Props = {
  form: Ref<Form>
  selectedVariant: Ref<VariantWithProductTitle>
  addons: Ref<Addons>
}

export type Item = {
  id: string
  title: string
  each: string
  quantity: number
  price: string
}

export function useItemsGenerator(data: Props) {
  const { form, selectedVariant, addons } = data

  const handlingFeeRow = computed(() => {
    if (!addons.value) return { quantity: 0 }

    const handlingFeeCost = addons.value.handling_fee.price.amount
    return {
      id: addons.value.handling_fee.id,
      title: 'Handling Fee',
      each: useFormatMoney(handlingFeeCost),
      quantity: form.value.quantity,
      price: useFormatMoney(handlingFeeCost * form.value.quantity),
    }
  })

  const productVariantRow = computed(() => {
    return {
      id: selectedVariant.value.id,
      title: selectedVariant.value.productTitle,
      each: useFormatMoney(
        +selectedVariant.value.priceV2.amount * form.value.length
      ),
      quantity: form.value.quantity,
      price: useFormatMoney(
        +selectedVariant.value.priceV2.amount *
          form.value.length *
          form.value.quantity
      ),
    }
  })

  const cutQuantity = computed(() => {
    if (
      form.value.length * form.value.quantity ===
      selectedVariant.value.quantityAvailable
    ) {
      return form.value.quantity - 1
    }
    return form.value.quantity
  })
  const cutFeeRow = computed(() => {
    if (!addons.value) return { quantity: 0 }

    const cutFeeCost = addons.value.cut_fee.price.amount
    return {
      id: addons.value.cut_fee.id,
      title: 'Cut Fee',
      each: useFormatMoney(cutFeeCost),
      quantity: cutQuantity.value,
      price: useFormatMoney(cutFeeCost * cutQuantity.value),
    }
  })

  const rows = computed(() =>
    [handlingFeeRow.value, productVariantRow.value, cutFeeRow.value].filter(
      (row) => row.quantity > 0
    )
  )

  return rows
}
