<template>
  <div class="mx-auto flex max-w-2xl flex-col">
    <h1 class="text-2xl font-bold">Cart</h1>

    <div class="rounded border p-2" v-for="{ node } in cart.lines?.edges">
      <p v-if="node.merchandise.addonType">This is a child</p>

      {{ node.merchandise.title }} - {{ node.quantity }} - ${{
        node.cost.totalAmount.amount
      }}
      <RemoveCartLineButton :cart-id="cart.id" :line-id="node.id" />
    </div>

    <NuxtLink
      :to="cart?.checkoutUrl"
      class="rounded bg-slate-800 py-2 px-1 text-center text-slate-100"
    >
      Checkout
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useHead } from '#app'

const { cart } = storeToRefs(useCartStore())
const { getCart } = useCartStore()
onMounted(() => getCart())
useHead({ title: 'Cart' })
</script>
