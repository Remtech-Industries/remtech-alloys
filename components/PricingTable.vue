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
          <div class="flex flex-col">
            <div>
              {{ row.title }}
            </div>

            <ul class="ml-5 list-disc font-thin">
              <li>Provided: 1.235" x 9</li>
              <li>Actual Cost*: 1.314" x 9</li>
            </ul>
          </div>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ formatMoney(row.pricePerPiece) }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ row.displayedQuantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ formatMoney(row.linePrice) }}
        </td>
      </tr>
    </tbody>

    <tfoot class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Total</th>
        <td />
        <td />
        <th class="px-6 py-3 text-right">
          {{ formatMoney(totalPrice) }}
        </th>
      </tr>
    </tfoot>
  </table>
  <p class="mt-3 text-xs font-thin">
    * Every piece is subject to a 0.078 inch additional cut waste fee
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatMoney } from '@/utils/format-money'

import type { Item } from '@/utils/items-generator'

const props = defineProps<{ items: Item[] }>()

const totalPrice = computed(() =>
  props.items.reduce((acc, { linePrice }) => acc + linePrice, 0)
)
</script>
