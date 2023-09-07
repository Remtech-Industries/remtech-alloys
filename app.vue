<template>
  <div>
    <SeoKit />
    <div class="flex justify-center bg-yellow-500 px-2">
      <div class="font-bold">
        Accepting request for quote (RFQ) for all orders requiring delivery. The
        check out experience is currently available for local pickup only.
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
  style: [{ children: 'body { background-color: #f8fafc }' }],
})
</script>
