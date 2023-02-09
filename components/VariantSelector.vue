<template>
  <div
    class="rounded border border-slate-300 p-2"
    :class="
      isActive
        ? 'bg-slate-700 text-slate-50 shadow-lg'
        : 'bg-slate-50 text-slate-700'
    "
  >
    <div>{{ useDisplayHeatNumber(variant.title) }}</div>

    <div class="text-xs font-thin">
      <div>
        {{ quantityAvailable }}
      </div>
      {{ price }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplayHeatNumber } from '~~/utils/display-heat-number'
import { computed } from 'vue'
import type { Variant } from '~~/utils/types'

interface Props {
  variant: Variant
  activeId: string
  stockingUnit: string
}

const props = defineProps<Props>()

const isActive = computed(() => {
  return props.variant.id === props.activeId
})

const quantityAvailable = computed(() => {
  const quantity = props.variant.quantityAvailable
  if (props.stockingUnit === 'mm') {
    return `${quantity}mm/${(quantity / 25.4).toFixed(3)}in`
  }
})

const price = computed(() => {
  const price = +props.variant.priceV2.amount
  if (props.stockingUnit === 'mm') {
    return `${price}/${props.stockingUnit}/${(price * 25.4).toFixed(2)}in`
  }
})
</script>
