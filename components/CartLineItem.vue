<template>
  <div class="flex justify-between gap-1">
    <div class="flex gap-1">
      <img
        v-if="cartLine.merchandise.image"
        :src="cartLine.merchandise.image.url"
        :alt="cartLine.merchandise.image.altText"
        width="64"
      />

      <div>
        <p class="text-slate-800">
          {{ cartLine.merchandise.product.title }}
        </p>

        <p class="text-sm text-slate-500">
          {{ cartLine.merchandise.title }}
        </p>
      </div>
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
