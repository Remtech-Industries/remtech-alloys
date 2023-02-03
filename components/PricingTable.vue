<template>
  <table class="w-full text-sm text-slate-700">
    <thead class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Item</th>
        <th class="px-6 py-3">Each</th>
        <th class="px-6 py-3">Qty</th>
        <th class="px-6 py-3">Price</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          {{ row.title }}
        </td>
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          {{ row.each }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ row.quantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ row.price }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ form: object }>()

const rows = computed(() => [
  {
    id: 1,
    title: 'Handling Fee',
    each: 5,
    quantity: 1,
    price: 5,
  },
])
</script>
