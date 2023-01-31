<template>
  <div class="mb-2 flex">
    <div class="rounded-l bg-slate-700 px-2 py-1 text-slate-50">Quantity</div>
    <input
      v-model="quantity"
      type="number"
      class="w-full rounded-r border px-2 py-1 shadow-inner"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const quantity = ref(1)
</script>
