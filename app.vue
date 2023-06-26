<template>
  <div class="bg-slate-50">
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Currently only shipping within Canada. USA coming soon. Rem-Tech Alloys
        is under heavy development. Thank you for your patience.
      </div>
    </div>

    <Header />

    <div class="container mx-auto max-w-screen-xl">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useHead } from 'nuxt/app'
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
getCart()

useHead({
  title: 'Rem-Tech Alloys',
  titleTemplate: '%s - Rem-Tech Alloys',
})
</script>
