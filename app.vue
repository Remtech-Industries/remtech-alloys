<template>
  <div>
    <SeoKit />
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Now offering FREE local delivery within 100 km of Aylmer AND along the
        401 and 403 from Windsor to Toronto!
      </div>
    </div>

    <Header />

    <NuxtLayout>
      <NuxtPage />
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
