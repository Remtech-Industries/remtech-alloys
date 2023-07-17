<template>
  <div
    class="cursor-pointer rounded border border-slate-300 p-2"
    :class="
      isActive
        ? 'bg-slate-600 text-slate-50 shadow-lg'
        : 'bg-slate-50 text-slate-700'
    "
  >
    <div class="whitespace-nowrap">{{ variant.title }}</div>

    <div class="whitespace-nowrap text-xs font-light">
      Bar Length: {{ quantityAvailable }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductVariant } from '@/utils/storefront-api-types'

interface Props {
  variant: ProductVariant
  activeId?: string
  stockingUnit?: string
}

const props = defineProps<Props>()

const isActive = computed(() => {
  if (!props.variant) return false
  return props.variant.id === props.activeId
})

const quantityAvailable = computed(() => {
  const quantity = props.variant.quantityAvailable
  if (props.stockingUnit === 'mm') {
    return `${((quantity || 0) / 25.4).toFixed(3)}"`
  }
})
</script>
