<template>
  <button
    :disabled="disabled"
    @click="addToCart(computedItems)"
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
    :class="disabledClass"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~~/stores/cart'
import type { Item } from '~~/utils/types'

const props = defineProps<{ items: Item[] }>()
const disabled = computed(() => !props.items.length)
const disabledClass = computed(() => {
  if (disabled.value) return 'cursor-not-allowed opacity-50'
  return 'cursor-pointer opacity-100'
})
const computedItems = computed(() =>
  props.items.map((item) => {
    return { quantity: item.quantity, merchandiseId: item.id }
  })
)

const { addToCart } = useCartStore()
</script>
