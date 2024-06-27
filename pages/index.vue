<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <DataTable
        v-if="collections && collections.length > 0"
        :value="collections"
        @row-click="({ data }) => goTo(data.handle)"
      >
        <Column field="title" header="Type">
          <template #body="{ data }">
            {{ data.title }}
          </template>
        </Column>
        <Column field="products.edges.length" header="Quantity" />
      </DataTable>

      <div v-else>
        <p class="text-center">No collections found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, navigateTo, useFetch } from '#imports'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { collectionsQuery } from '@/utils/collections'
import type { CollectionsResponse } from '@/utils/types'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { handleMapping } from '@/utils/handle-mapping'

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const { data: jobbossData } = await useFetch<{ products: [] }>(
  'https://data.remtechalloys.com/remtech_alloys_inventory_levels.json',
  { lazy: true, server: false },
)

const staticCollectionsWithQuantity = computed(() => {
  const products = jobbossData.value?.products || []

  return Object.entries(handleMapping).map(([handle, strings]) => {
    const length = products.filter((product: { partno: string }) =>
      product.partno.includes(strings.searchJobbossWith),
    ).length
    return {
      handle,
      title: strings.displayTitle,
      products: { edges: { length } },
    }
  })
})

const collections = computed(() => {
  if (!data.value?.data?.collections?.edges) {
    return staticCollectionsWithQuantity.value
  }

  const allCollections = staticCollectionsWithQuantity.value

  data.value.data.collections.edges.forEach(({ node }) => {
    if (
      !allCollections.some((collection) => node.handle === collection.handle)
    ) {
      allCollections.push(node)
    } else {
      const index = allCollections.findIndex(
        (collection) => collection.handle === node.handle,
      )
      allCollections[index].products.edges.length += node.products.edges.length
    }
  })

  return allCollections.sort((a, b) => a.title.localeCompare(b.title))
})

const goTo = async (handle: string) => {
  await navigateTo(`/collections/${handle}`)
}
</script>
