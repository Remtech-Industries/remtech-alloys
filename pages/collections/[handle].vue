<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="p-6" v-if="collection">
      <div class="mb-6 flex items-baseline">
        <h1
          class="border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          {{ collection.title }}
        </h1>

        <p class="pl-4 text-sm font-thin">{{ collection.description }}</p>
      </div>

      <div class="w-full rounded-xl bg-white p-6">
        <table class="text-slate-700">
          <thead>
            <tr class="border-b border-slate-300 bg-slate-100">
              <th class="p-3 text-left font-normal">Size</th>
              <th class="p-3 text-left font-normal">Price/Inch</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="{ node } in products" :key="node.id" class="border-b">
              <td class="border-r p-3">
                <NuxtLink :to="`/products/${node.handle}`">
                  {{ node.title }}
                </NuxtLink>
              </td>

              <td class="p-3">
                {{
                  toMoney(
                    toPricePerInch(
                      +node.priceRange.minVariantPrice.amount,
                      'mm'
                    )
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGetCollection } from '@/proxies/get-collection'
import { toMoney } from '@/utils/to-money'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import type { ProductEdge, Collection } from '@/utils/storefront-api-types'
import { toPricePerInch } from '@/utils/to-price-per-inch'
const { params } = useRoute()

const collection = ref<Collection | null>(null)
const products = ref<ProductEdge[]>([])

onMounted(async () => {
  const handle =
    typeof params.handle === 'string' ? params.handle : params.handle[0] || ''
  const response = await useGetCollection(handle)
  collection.value = response.collection
  products.value = response.collection.products.edges
})
</script>
