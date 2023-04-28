<template>
  <table class="w-full text-sm text-slate-700">
    <thead class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Item</th>
        <th class="px-6 py-3 text-right">Each</th>
        <th class="px-6 py-3 text-center">Qty</th>
        <th class="px-6 py-3 text-right">Price</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in items" :key="row.id">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          <p>{{ row.title }}</p>

          <p>
            {{ isDefined(row.length) ? `Length: ${row.length} mm` : '' }}
          </p>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
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

    <tfoot class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Total</th>
        <td />
        <td />
        <th class="px-6 py-3 text-right">
          {{ totalPrice }}
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<script setup lang="ts">
import { isDefined } from '@vueuse/core'
import { computed } from 'vue'

import { formatMoney } from '@/utils/format-money'

import type { Item } from '@/utils/items-generator'

const props = defineProps<{ items: Item[] }>()

const totalPrice = computed(() =>
  formatMoney(props.items.reduce((acc, item) => acc + item.numberPrice, 0))
)
</script>
