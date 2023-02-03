<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useCartStore } from '~~/stores/cart'
import { storeToRefs } from 'pinia'

const { cart } = storeToRefs(useCartStore())
if (process.client) {
  const localCart = window.localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : {}
}
</script>
