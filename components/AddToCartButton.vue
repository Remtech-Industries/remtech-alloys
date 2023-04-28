<template>
  <button
    :disabled="disabled"
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
    :class="disabledClass"
    @click="onClick()"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
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
      quantity: item.quantity * Math.ceil(item.length || 1),
      merchandiseId: item.id,
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
