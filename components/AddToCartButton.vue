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
import { Form, Variant } from '~~/utils/types'

const { addToCart } = useCartStore()

interface Props {
  form: Form
  selectedVariant: Variant
}
const props = defineProps<Props>()

const items = computed(() => {
  return [
    {
      quantity: props.form.quantity,
      merchandiseId: props.selectedVariant.id,
    },
  ]
})
</script>
