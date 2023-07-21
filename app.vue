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

    <div class="container mx-auto max-w-screen-xl">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useHead } from '#imports'
import { useCartStore } from '@/stores/cart'
import { useBugsnag } from '#imports'
const { getCart } = useCartStore()
getCart()

useHead({
  title: 'Rem-Tech Alloys',
  titleTemplate: '%s - Rem-Tech Alloys',
})
</script>
