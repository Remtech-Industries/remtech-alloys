<template>
  <h1>Cart</h1>
  <p>Here is your cart</p>
  <NuxtLink :href="cart.checkoutUrl">Checkout</NuxtLink>
</template>

<script setup lang="ts">
import { useCartStore } from '~~/stores/cart'
import { useHead } from '#app'

const { cart } = useCartStore()
useHead({ title: 'Cart' })
</script>
