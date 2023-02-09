<template>
  <h1 class="text-2xl">Cart</h1>
  <p>Here is your cart</p>
  <div class="rounded border p-2" v-for="{ node } in cart.lines?.edges">
    {{ node.merchandise.title }} - {{ node.quantity }} - ${{
      node.cost.totalAmount.amount
    }}
  </div>
  <NuxtLink :to="cart.checkoutUrl">Checkout</NuxtLink>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '~~/stores/cart'
import { storeToRefs } from 'pinia'
import { useHead } from '#app'

const { cart } = storeToRefs(useCartStore())
const { getCart } = useCartStore()
onMounted(() => getCart())
useHead({ title: 'Cart' })
</script>
