<template>
  <button
    :disabled="disabled"
    class="rounded bg-slate-700 px-2 py-1 text-slate-200 hover:bg-yellow-500 hover:text-slate-700"
    :class="disabledClass"
    @click="onClick()"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { computed, useRouter } from '#imports'
import { useCartStore } from '@/stores/cart'
import type { Item } from '@/utils/items-generator'

const props = defineProps<{ items: Item[] }>()
const disabled = computed(() => !props.items.length)
const disabledClass = computed(() => {
  if (disabled.value) return 'cursor-not-allowed opacity-50'
  return 'cursor-pointer opacity-100'
})

const computedItems = computed(() =>
  props.items.map((item) => {
    return {
      merchandiseId: item.id,
      quantity: item.cartQuantity,
      attributes: item.attributes,
    }
  })
)

const { addToCart } = useCartStore()
const router = useRouter()
async function onClick() {
  await addToCart(computedItems.value)
  router.push({ name: 'index' })
}
</script>
