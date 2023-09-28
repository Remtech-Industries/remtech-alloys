<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div v-if="error">{{ error }}</div>

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
          v-if="products"
          scrollable
          v-model:filters="filters"
          :value="products"
          @row-click="({ data }) => goTo(data.handle)"
        >
          <template #header>
            <div class="flex justify-end">
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </div>
          </template>

          <Column field="title" frozen header="Size" style="min-width: 180px">
            <template #body="{ data }">
              {{ data.title }}
            </template>
          </Column>

          <Column header="Price/Inch">
            <template #body="{ data }">
              {{
                toMoney(
                  toPricePerInch(+data.priceRange.minVariantPrice.amount, 'mm'),
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
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import { collectionQuery } from '@/utils/collections'
import type { CollectionResponse } from 'utils/types'
import { toPricePerInch, toMoney, toInches } from '@/utils/conversion'
import {
  navigateTo,
  computed,
  useLazyFetch,
  ref,
  useHead,
  useRoute,
} from '#imports'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
const { params } = useRoute()

const variables = computed(() => {
  const handle =
    typeof params.handle === 'string' ? params.handle : params.handle[0] || ''
  return { handle }
})

const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS,
  },
})

const { data, error } = await useLazyFetch<CollectionResponse>(
  useShopifyUrl(),
  {
    ...useShopifyOptions(collectionQuery, variables.value),
    key: `collection-${variables.value.handle}`,
  },
)

const collection = computed(() => {
  return data.value?.data?.collection
})

const products = computed(() => {
  return collection.value?.products.edges.map(({ node }) => node)
})

useHead({
  title: collection.value?.title,
})

const goTo = async (handle: string) => {
  await navigateTo(`/products/${handle}`)
}
</script>
