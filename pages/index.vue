<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <DataTable
        v-if="collections && collections.length > 0"
        row-hover
        :value="collections"
        class="p-datatable-sm"
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { collectionsQuery } from '@/utils/collections'
import { useFetch, computed, navigateTo } from '#imports'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import type { CollectionsResponse } from 'utils/types'

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const collections = computed(() => {
  return data.value?.data?.collections?.edges.map(({ node }) => node)
})

const goTo = async (handle: string) => {
  await navigateTo(`/collections/${handle}`)
}
</script>
