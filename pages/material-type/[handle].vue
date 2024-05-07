<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="w-full p-6">
      <div class="mb-6 flex flex-col items-baseline">
        <h1
          class="mb-3 border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          Alloy 20
        </h1>
      </div>

      <div class="rounded-xl bg-white p-6">
        <DataTable v-if="products && products.length > 0" :value="products">
          <Column header="Size" #body="{ data }">
            {{ data.partno }}
          </Column>

          <Column header="Stock" #body="{ data }">
            <span
              v-if="data.qtyonhand > 0"
              class="text-sm font-light text-green-600"
            >
              {{ data.qtyonhand }}" In Stock
            </span>

            <span v-else class="text-sm font-light text-red-600">
              Out of Stock
            </span>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useFetch } from '#imports'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

const { data } = await useFetch<{ products: [] }>(
  'http://data.remtechalloys.com/remtech_alloys_inventory_levels.json',
  { lazy: true, server: false },
)

const products = computed(
  () =>
    data.value?.products.filter((item: any) => item.partno.startsWith('ALLOY')),
)
</script>
