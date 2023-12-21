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
import { storeToRefs } from 'pinia'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useShopStore } from '@/stores/shop'
import { onMounted, useHead } from '#imports'
import { useCartStore } from '@/stores/cart'
import { useRoute } from 'vue-router'
const { getCart } = useCartStore()
const { getShop } = useShopStore()
getCart()
getShop()

useHead({
  title: 'Rem-Tech Alloys',
  style: [{ children: 'body { background-color: #f8fafc }' }],
})

/**
 * Unlock the app only if the user has the correct key
 */
const { isUnlocked } = storeToRefs(useCartStore())
const route = useRoute()
onMounted(() => {
  const key = 'u0q289hasdvu8g04cmq032ryq2h0svndjq9we0q2u8fh8dadafg43q2sfa3qt4h'
  if (route.query.key === key) isUnlocked.value = true
})
</script>
