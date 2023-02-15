<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
getCart()
</script>
