<template>
  <div>
    <div class="flex">
      <div class="rounded-l bg-slate-700 px-2 py-1 text-slate-50">Quantity</div>
      <input
        v-model="quantity"
        type="number"
        class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
        :class="quantityState ? 'border-red-500' : ''"
      />
    </div>

    <p class="ml-1 text-sm text-red-500">
      {{ quantityState }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

const quantity: Ref<number | string> = ref(1)
const quantityState = computed(() => {
  if (quantity.value === '') return 'Quantity is required.'
  if (quantity.value <= 0) return 'Quantity must be more than 0.'
  if (parseInt(`${quantity.value}`) !== quantity.value)
    return 'Quantity must be a whole number.'
  return ''
})
</script>
