<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <DataTable
        v-if="data"
        row-hover
        :value="data.collections.edges.map(({ node }) => node)"
        class="p-datatable-sm"
        @row-click="({ data }) => $router.push(`/collections/${data.handle}`)"
      >
        <Column field="title" header="Type">
          <template #body="{ data }">
            <NuxtLink :to="`/collections/${data.handle}`">
              {{ data.title }}
            </NuxtLink>
          </template>
        </Column>
        <Column field="products.edges.length" header="Quantity" />
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useGetCollections } from '@/proxies/get-collections'
import CollectionSidebar from '@/components/CollectionSidebar.vue'

const { data, doGet } = useGetCollections()
await doGet()
</script>
