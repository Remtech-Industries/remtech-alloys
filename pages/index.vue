<template>
  <div class="flex">
    <CollectionSidebar />

    <table class="text-slate-700">
      <thead>
        <tr class="border-b">
          <th class="border-r py-1">Name</th>
          <th class="py-1"># of Products</th>
        </tr>
      </thead>

      <tbody>
        <tr class="border-b" v-for="item in collections">
          <td class="border-r pr-6">
            <NuxtLink :to="`/collections/${item.node.handle}`">
              {{ item.node.title }}
            </NuxtLink>
          </td>
          <td>{{ item.node.products.edges.length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CollectionSidebar from '@/components/CollectionSidebar.vue'

const collections = ref([])

async function getCollections() {
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
            collections(first: 100) {
              edges {
                node {
                  id
                  title
                  handle
                  products(first: 100) {
                    edges {
                      node {
                        id
                        title
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
  collections.value = response.data.collections.edges
}
getCollections()
</script>
