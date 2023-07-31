<template>
  <div>
    <SeoKit />
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Rem-Tech Alloys is under heavy development. We are currently accepting
        orders as a request for quote. Thank you for your patience.
      </div>
    </div>

    <Header />

    <NuxtLayout>
      <NuxtPage />
      <button class="p-2 bg-slate-400" @click="getShop">get</button>

    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useShopStore } from '@/stores/shop'
import { useHead } from '#imports'
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
const { getShop } = useShopStore()
getCart()
getShop()

useHead({
  title: 'Rem-Tech Alloys',
  style: [{ children: 'body { background-color: #f8fafc }' }],
})
</script>
