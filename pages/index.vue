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

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const staticCollections = [{ title: 'Alloy 20', handle: 'alloy-20' }] as const

const collections = computed(() => {
  if (!data.value?.data?.collections?.edges) return staticCollections
  return [
    ...staticCollections,
    ...data.value.data.collections.edges.map(({ node }) => node),
  ]
})

const goTo = async (handle: string) => {
  await navigateTo(`/collections/${handle}`)
}
</script>
