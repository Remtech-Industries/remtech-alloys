<template>
  <div class="flex justify-between gap-1">
    <div class="flex-col gap-1">
      <p class="text-slate-800">
        {{ cartLine.merchandise.product.title }}
      </p>

      <p class="text-sm text-slate-500">
        {{ cartLine.merchandise.title }}
      </p>
    </div>

    <div class="flex gap-2">
      <p class="self-center">
        {{ formatMoney(+cartLine.cost.totalAmount.amount) }}
      </p>

      <div v-if="cartId && removeItems.length" class="self-center">
        <RemoveCartLineButton :cart-id="cartId" :line-ids="removeItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/format-money'
import type { CartLine } from '@/utils/types'

interface Props {
  cartId?: string
  cartLine: CartLine
  removeItems?: string[]
}
withDefaults(defineProps<Props>(), { removeItems: () => [] })
</script>
