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

            <ul v-if="row.requestedLength" class="ml-5 list-disc font-thin">
              <li>
                Requested*:
                {{ toInches(row.requestedLength, 'mm', 'roundIt') }}" x
                {{ row.displayedQuantity }}
              </li>
              <li>
                Length Charged&dagger;:
                {{
                  toInches(
                    row.cartQuantity / row.displayedQuantity,
                    'mm',
                    'roundIt'
                  )
                }}" x
                {{ row.displayedQuantity }}
              </li>
            </ul>
          </div>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(row.pricePerPiece) }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ row.displayedQuantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(row.linePrice) }}
        </td>
      </tr>
    </tbody>

    <tfoot class="bg-slate-100 text-left text-xs uppercase text-slate-700">
      <tr>
        <th class="px-6 py-3">Total</th>
        <td />
        <td />
        <th class="px-6 py-3 text-right">
          {{ toMoney(totalPrice) }}
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toMoney } from '@/utils/to-money'
import type { Item } from '@/utils/items-generator'
import { toInches } from '@/utils/to-inches'

const props = defineProps<{ items: Item[] }>()

const totalPrice = computed(() =>
  props.items.reduce((acc, { linePrice }) => acc + linePrice, 0)
)
</script>
