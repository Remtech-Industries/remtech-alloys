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
            <th class="border-b py-1 font-semibold text-slate-700">Price</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="product in products" :key="product.node.id">
            <td class="border-b py-1 px-4 text-slate-600">
              <NuxtLink :to="`/products/${product.node.handle}`">{{
                product.node.title
              }}</NuxtLink>
            </td>

            <td class="border-b py-1 px-4 text-slate-600">
              {{ product.node.priceRange.minVariantPrice.amount }}
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
import CollectionSidebar from '@/components/CollectionSidebar.vue'
const { params } = useRoute()

const collection = ref({})
const products = ref([])

onMounted(async () => {
  const result = await fetch(
    'https://remtech-dev.myshopify.com/api/2023-01/graphql.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': 'ca9a09f596e0d350accac97729f6d540',
      },
      body: JSON.stringify({
        query: `
          query {
            collection(handle: "${params.handle}") {
              id
              handle
              title
              description
              products(first: 100) {
                edges {
                  node {
                    id
                    title
                    handle
                    priceRange {
                      minVariantPrice {
                        amount
                      }
                      maxVariantPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    }
  )

  const response = await result.json()
  collection.value = response.data.collection
  products.value = response.data.collection.products.edges
})
</script>
