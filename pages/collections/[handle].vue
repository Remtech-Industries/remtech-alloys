<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div class="w-full p-6" v-if="collection">
      <div class="mb-6 flex flex-col items-baseline">
        <h1
          class="mb-3 border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          {{ collection.title }}
        </h1>

        <p class="pl-4 text-sm font-light">{{ collection.description }}</p>
      </div>

      <div class="rounded-xl bg-white p-6">
        <DataTable
          row-hover
          scrollable
          v-model:filters="filters"
          class="p-datatable-sm"
          :value="products.map(({ node }) => node)"
          @row-click="({ data }) => $router.push(`/products/${data.handle}`)"
        >
          <template #header>
            <div class="flex justify-end">
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
                class="p-inputtext-sm"
              />
            </div>
          </template>

          <Column field="title" frozen header="Size" style="min-width: 180px" />

          <Column header="Price/Inch">
            <template #body="{ data }">
              {{
                toMoney(
                  toPricePerInch(+data.priceRange.minVariantPrice.amount, 'mm')
                )
              }}
            </template>
          </Column>

          <Column header="Stock" #body="{ data }" style="min-width: 100px">
            <span
              v-if="data.totalInventory > 0"
              class="text-sm font-light text-green-600"
            >
              {{ Math.floor(toInches(+data.totalInventory, 'mm', 'roundIt')) }}"
              In Stock
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api'
import { useGetCollection } from '@/proxies/get-collection'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import type { ProductEdge, Collection } from '@/utils/storefront-api-types'
import { toPricePerInch, toMoney, toInches } from '@/utils/conversion'
import { onMounted, ref, useHead, useRoute } from '#imports'
const { params } = useRoute()

const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS,
  },
})
const collection = ref<Collection | null>(null)
const products = ref<ProductEdge[]>([])

onMounted(async () => {
  const handle =
    typeof params.handle === 'string' ? params.handle : params.handle[0] || ''
  const response = await useGetCollection(handle)
  collection.value = response.collection
  products.value = response.collection.products.edges
})

useHead({
  title: collection?.value?.title,
})
</script>
