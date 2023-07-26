<template>
  <div>
    <SeoKit />
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Rem-Tech Alloys is under heavy development. We are currently offering
        local pickup only. Thank you for your patience.
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
import { useHead } from '#imports'
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
getCart()

useHead({
  title: 'Rem-Tech Alloys',
})
</script>
