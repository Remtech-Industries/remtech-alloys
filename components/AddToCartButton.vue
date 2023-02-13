<template>
  <button
    :disabled="disabled"
    @click="addToCart(items)"
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
    :class="
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
    "
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~~/stores/cart'
import type { Form, Variant } from '~~/utils/types'

const { addToCart } = useCartStore()

interface Props {
  form: Form
  selectedVariant: Variant
}
const props = defineProps<Props>()

const disabled = computed(() => {
  return !props.form.quantity || !props.selectedVariant || !props.form.length
})

const items = computed(() => {
  return [
    {
      quantity: props.form.quantity,
      merchandiseId: props.selectedVariant.id,
    },
  ]
})
</script>
