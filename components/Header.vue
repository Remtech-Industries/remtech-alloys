<template>
  <div class="border-b bg-slate-900 p-2 opacity-90 shadow-lg">
    <div class="container mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <img src="/logo.png" alt="Rem-Tech Alloys Logo" width="200" />
      </NuxtLink>

      <div class="flex gap-2 text-slate-50">
        <div
          v-show="showAddedToCartAlert"
          class="self-end text-base font-semibold"
        >
          Added to cart!
        </div>

        <div class="flex flex-col">
          <div class="font-oswald">(519) 773-3455</div>

          <NuxtLink to="/cart" class="font-semibold">
            <span class="mr-1">Cart</span>

            <span class="rounded bg-yellow-500 px-1 text-sm">
              {{ itemCount }}
            </span>
          </NuxtLink>
        </div>
      </div>
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
