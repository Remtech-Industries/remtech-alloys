<template>
  <table class="w-full text-sm text-slate-700">
    <thead
      class="border-b bg-slate-100 text-left text-xs uppercase text-slate-700"
    >
      <tr>
        <th class="px-6 py-3">Item</th>
        <th class="px-6 py-3 text-right">Each</th>
        <th class="px-6 py-3 text-center">Qty</th>
        <th class="px-6 py-3 text-right">Price</th>
      </tr>
    </thead>

    <tbody>
      <!-- product -->
      <tr v-if="product">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          <div class="flex flex-col">
            <div>
              {{ product.title }}
            </div>

            <ul class="ml-5 list-disc font-thin">
              <li v-if="product.requestedLength">
                Requested*:
                {{ toInches(product.requestedLength, 'mm', 'roundIt') }}" x
                {{ product.displayedQuantity }}
              </li>
              <li>
                Length Charged&dagger;:
                {{
                  toInches(
                    product.cartQuantity / product.displayedQuantity,
                    'mm',
                    'roundIt'
                  )
                }}" x
                {{ product.displayedQuantity }}
              </li>
            </ul>
          </div>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(product.pricePerPiece) }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ product.displayedQuantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(product.linePrice) }}
        </td>
      </tr>

      <!-- handling token -->
      <tr v-if="handlingToken">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          <div class="flex flex-col">
            <div>
              {{ handlingToken.title }}
            </div>

            <ul class="ml-5 list-disc font-thin">
              <li>
                {{ handlingToken.cartQuantity }} tokens @
                {{
                  handlingToken.attributes.find(({ key }) => key === 'Price')
                    ?.value
                }}
              </li>
            </ul>
          </div>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(handlingToken.pricePerPiece) }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ handlingToken.displayedQuantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(handlingToken.linePrice) }}
        </td>
      </tr>

      <!-- cut token -->
      <tr v-if="cutToken">
        <td class="border-b px-6 py-2 font-medium text-slate-700">
          <div class="flex flex-col">
            <div>
              {{ cutToken.title }}
            </div>

            <ul class="ml-5 list-disc font-thin">
              <li>
                {{ cutToken.cartQuantity }} tokens @
                {{
                  cutToken.attributes.find(({ key }) => key === 'Price')?.value
                }}
              </li>
            </ul>
          </div>
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(cutToken.pricePerPiece) }}
        </td>
        <td class="border-b px-6 py-2 text-center font-medium text-slate-700">
          {{ cutToken.displayedQuantity }}
        </td>
        <td class="border-b px-6 py-2 text-right font-medium text-slate-700">
          {{ toMoney(cutToken.linePrice) }}
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
import type { Item } from '@/utils/items-generator'
import { toInches, toMoney } from '@/utils/conversion'

const props = defineProps<{ items: Item[] }>()

const totalPrice = computed(() =>
  props.items.reduce((acc, { linePrice }) => acc + linePrice, 0)
)

const product = computed(() =>
  props.items.find(({ anchor }) => anchor === 'product')
)

const cutToken = computed(() =>
  props.items.find(({ anchor }) => anchor === 'cut-token')
)

const handlingToken = computed(() =>
  props.items.find(({ anchor }) => anchor === 'handling-token')
)
</script>
