<template>
  <div class="flex items-center justify-between border-b p-2">
    <NuxtLink to="/" class="text-3xl font-bold text-slate-700">
      <img src="/logo.png" width="200px" />
    </NuxtLink>

    <NuxtLink to="/cart" class="flex gap-1 font-semibold text-slate-700">
      <p>Cart</p>

      <p class="self-center rounded bg-slate-600 px-1 text-sm text-slate-100">
        {{ itemCount }}
      </p>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
const { itemCount } = storeToRefs(useCartStore())
</script>
