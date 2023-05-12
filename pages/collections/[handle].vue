<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="p-2" v-if="collection">
      <div class="mb-3 flex items-baseline">
        <h1
          class="border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          {{ collection.title }}
        </h1>

        <p class="pl-4 text-sm font-thin">{{ collection.description }}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th class="border-b py-1 font-semibold text-slate-700">Size</th>
            <th class="border-b py-1 font-semibold text-slate-700">
              Price/Inch
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="{ node } in products" :key="node.id">
            <td class="border-b py-1 px-4 text-slate-600">
              <NuxtLink :to="`/products/${node.handle}`">
                {{ node.title }}
              </NuxtLink>
            </td>

            <td class="border-b py-1 px-4 text-slate-600">
              {{
                formatMoney(+node.priceRange.minVariantPrice.amount * mmInInch)
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGetCollection } from '@/proxies/get-collection'
import { mmInInch } from '@/utils/constants'
import { formatMoney } from '@/utils/format-money'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import type { ProductEdge, Collection } from '@/utils/storefront-api-types'
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
