<template>
  <button
    @click="addToCart(items)"
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~~/stores/cart'

const { addToCart } = useCartStore()

interface Props {
  form: object
  selectedVariant: object
}
const props = defineProps<Props>()

// {"data":{"cartCreate":{"cart":{"id":"gid://shopify/Cart/8c1440386e1e325a270b62e92a00e0ee"}}}}

const items = computed(() => {
  return [
    {
      quantity: props.form.quantity,
      merchandiseId: props.selectedVariant.id,
    },
  ]
})
</script>
