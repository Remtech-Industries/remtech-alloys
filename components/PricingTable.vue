<template>
  <table class="w-full text-sm text-slate-700">
    <thead class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Item</th>
        <th class="px-6 py-3">Each</th>
        <th class="px-6 py-3">Qty</th>
        <th class="px-6 py-3">Price</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          {{ row.title }}
        </td>
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          {{ row.each }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ row.quantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ row.price }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplayHeatNumber } from '~~/utils/display-heat-number'
import { useFormatMoney } from '~~/utils/format-money'
import type { Form, Product, Variant } from '~~/utils/types'

const props = defineProps<{
  form: Form
  product: Product
  variant: Variant
}>()

const handlingFeeCost = 5
const handlingFeeRow = computed(() => {
  return {
    id: 'handling-fee-id',
    title: 'Handling Fee',
    each: useFormatMoney(handlingFeeCost),
    quantity: props.form.quantity,
    price: useFormatMoney(handlingFeeCost * +(props.form.quantity || 0)),
  }
})

const productVariantRow = computed(() => {
  return {
    id: props.variant.id,
    title: `${props.product.title} ${useDisplayHeatNumber(
      props.variant.title
    )}`,
    each: useFormatMoney(+props.variant.priceV2.amount),
    quantity: props.form.quantity,
    price: useFormatMoney(
      +props.variant.priceV2.amount * +(props.form.quantity || 0)
    ),
  }
})

const rows = computed(() => [handlingFeeRow.value, productVariantRow.value])
</script>
