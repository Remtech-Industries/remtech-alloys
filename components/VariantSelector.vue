<template>
  <div class="rounded border border-slate-300 p-2">
    <div>{{ useDisplayHeatNumber(variant.title) }}</div>

    <div class="text-xs font-thin">
      {{ variant.quantityAvailable }}
      {{ variant.priceV2.amount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplayHeatNumber } from '~~/utils/display-heat-number'
import type { Variant } from '~~/utils/types'

interface Props {
  variant: Variant
}

const props = defineProps<Props>()
</script>
