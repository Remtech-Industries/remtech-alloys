<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="p-2">
      <div class="mb-3 flex items-baseline">
        <h1 class="text-center text-3xl">{{ collection.title }}</h1>

        <p class="pl-4 text-sm font-thin">{{ collection.description }}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th class="border-b py-1 font-semibold text-slate-700">Size</th>
            <th class="border-b py-1 font-semibold text-slate-700">Price/Inch</th>
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
              {{ node.priceRange.minVariantPrice.amount }}
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
import CollectionSidebar from '@/components/CollectionSidebar.vue'
const { params } = useRoute()

const collection = ref({})
const products = ref([])

onMounted(async () => {
  const response = await useGetCollection(params.handle)
  collection.value = response.collection
  products.value = response.collection.products.edges
})
</script>
