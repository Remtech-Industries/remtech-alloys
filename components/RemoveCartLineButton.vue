<template>
  <button
    class="h-6 w-6 rounded-full bg-slate-800 text-center text-slate-100"
    @click="removeFromCart(cartId, lineIds)"
  >
    X
  </button>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
interface Props {
  cartId: string
  lineIds: string[]
}
const props = defineProps<Props>()
const { removeFromCart } = useCartStore()
</script>
