<template>
  <div class="flex items-center justify-between border-b p-2">
    <NuxtLink to="/" class="text-3xl font-bold text-slate-700">
      <img src="/logo.png" width="200px" />
    </NuxtLink>

    <NuxtLink to="/cart" class="font-semibold text-slate-700">
      Cart
      <span class="rounded bg-slate-600 px-1 text-slate-100">a</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// import { useCartStore } from '@/stores/cart'
// import { storeToRefs } from 'pinia'
// const { itemCount } = storeToRefs(useCartStore())
</script>
