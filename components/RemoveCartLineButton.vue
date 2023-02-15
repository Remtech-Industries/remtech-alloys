<template>
  <button
    class="rounded-full bg-slate-800 px-1 text-center text-slate-100"
    @click="removeFromCart(cartId, lineId)"
  >
    X
  </button>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
interface Props {
  cartId: string
  lineId: string
}
const props = defineProps<Props>()
const { removeFromCart } = useCartStore()
</script>
