<template>
  <div v-if="show" class="h-screen bg-slate-50">
    <div class="flex justify-center bg-yellow-500">
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

  <div class="m-auto flex w-96 flex-col text-center" v-else>
    <div class="text-2xl font-extrabold">Under Construction</div>
    <input
      class="w-96 rounded border border-slate-500"
      placeholder="Enter password"
      autofocus
      v-model="pass"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
const { getCart } = useCartStore()
getCart()

const pass = ref('')

const show = computed(() => {
  return pass.value === '123'
})
</script>
