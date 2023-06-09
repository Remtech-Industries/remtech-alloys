<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <DataTable
        row-hover
        :value="collections.map(({ node }) => node)"
        class="p-datatable-sm"
        @row-click="({ data }) => $router.push(`/collections/${data.handle}`)"
      >
        <Column field="title" header="Type" />
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

const collections = await useGetCollections()
</script>
