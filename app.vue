<template>
  <div class="flex min-h-screen flex-col">
    <SeoKit />
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Now offering FREE delivery along the 401 and 403 from Windsor to
        Toronto!
      </div>
    </div>

    <Header />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
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
