<template>
  <div
    class="flex items-center justify-between border-b bg-slate-50 p-2 shadow"
  >
    <NuxtLink to="/" class="text-3xl font-bold text-slate-700">
      <img src="logo.png" alt="Rem-Tech Alloys Logo" width="200" />
    </NuxtLink>

    <div class="flex flex-col">
      <div>(519) 773-3455</div>

      <NuxtLink to="/cart" class="font-semibold text-slate-700">
        <span
          v-show="showAddedToCartAlert"
          class="mr-1 text-base text-slate-700"
        >
          Added to cart!
        </span>

        <span class="mr-1 text-slate-700">Cart</span>

        <span class="rounded bg-yellow-500 px-1 text-sm text-slate-100">
          {{ itemCount }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { ref, watch } from 'vue'

const showAddedToCartAlert = ref(false)

const { itemCount } = storeToRefs(useCartStore())
watch(itemCount, (oldCount, newCount) => {
  if (oldCount > newCount) {
    showAddedToCartAlert.value = true
    setTimeout(() => (showAddedToCartAlert.value = false), 3000)
  }
})
</script>
