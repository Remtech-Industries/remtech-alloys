<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
getCart()
</script>
