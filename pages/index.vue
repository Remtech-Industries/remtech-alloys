<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <DataTable
        v-if="materials && materials.length > 0"
        :value="materials"
        data-key="title"
        @row-click="({ data }) => goTo(data.title)"
      >
        <Column field="title" header="Type" />

        <Column field="quantity" header="Quantity" />
      </DataTable>

      <div v-else>
        <p class="text-center">No collections found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo, storeToRefs, computed } from '#imports'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useMaterialInfoStore } from '@/stores/material-info'

const { materialInfo } = storeToRefs(useMaterialInfoStore())
const materials = computed(() =>
  materialInfo.value?.material_groups.flatMap(({ materials }) =>
    materials.map(({ title, parts }) => ({ title, quantity: parts.length })),
  ),
)

const goTo = async (handle: string) => {
  await navigateTo(`/collections/${handle}`)
}
</script>
