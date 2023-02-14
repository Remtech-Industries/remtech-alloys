import { useFormatMoney } from '~~/utils/format-money'
import { computed } from 'vue'
import type { Form, Product, Variant } from '~~/utils/types'
import type { Ref } from 'vue'

type Props = {
  form: Ref<Form>
  selectedVariant: Ref<Variant>
  addons: Ref<Variant[] | null>
}

export function useItemsGenerator(data: Props) {
  const { form, selectedVariant, addons } = data

  const handlingFeeCost = 5
  const handlingFeeRow = computed(() => {
    return {
      id: 'handling-fee-id',
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

  const cutFeeCost = 8
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
    return {
      id: 'cut-fee-id',
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
