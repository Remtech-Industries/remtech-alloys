<template>
  <div class="mb-2 flex w-full">
    <div
      class="whitespace-nowrap rounded-l bg-slate-700 px-2 py-1 text-slate-50"
    >
      PO #
    </div>

    <input
      v-model="po"
      type="text"
      placeholder="(optional)"
      class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from '#imports'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const { po } = storeToRefs(useCartStore())
const { updatePoNumber } = useCartStore()

onBeforeUnmount(() => updatePoNumber())
</script>
