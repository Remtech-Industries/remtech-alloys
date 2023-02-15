<template>
  <div class="flex items-center justify-between border-b p-2">
    <NuxtLink to="/" class="text-3xl font-bold text-slate-700">
      <img src="/logo.png" width="200px" />
    </NuxtLink>

    <NuxtLink to="/cart" class="font-semibold text-slate-700">
      <span class="mr-1 text-slate-700">Cart</span>

      <span class="rounded bg-slate-600 px-1 text-sm text-slate-100">
        {{ itemCount }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { watch } from 'vue'

const { itemCount } = storeToRefs(useCartStore())
watch(itemCount, (oldCount, newCount) => {
  if (oldCount > newCount) {
    // TODO: animate something in the header
  }
})
</script>
