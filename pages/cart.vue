<template>
  <h1>Cart</h1>
  <p>Here is your cart</p>
</template>

<script setup lang="ts">
import { useCartStore } from '~~/stores/cart'
import { useHead } from '#app'
useHead({ title: 'Cart' })

const { cart } = useCartStore()
</script>
