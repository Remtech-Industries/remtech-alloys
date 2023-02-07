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
      {{ variant.quantityAvailable }}
      {{ variant.priceV2.amount }}
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
}

const props = defineProps<Props>()

const isActive = computed(() => {
  return props.variant.id === props.activeId
})
</script>
