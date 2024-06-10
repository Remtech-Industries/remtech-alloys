<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div v-if="error">{{ error }}</div>

    <div
      v-if="collection || handleMapping[variables.handle]"
      class="w-full p-6"
    >
      <div class="mb-6 flex flex-col items-baseline">
        <h1
          class="mb-3 border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          <span v-if="collection">{{ collection.title }}</span>

          <span v-else>
            {{ handleMapping[variables.handle].replaceJobbossWith }}
          </span>
        </h1>

        <p v-if="collection" class="pl-4 text-sm font-light">
          {{ collection.description }}
        </p>
      </div>

      <div class="rounded-xl bg-white p-6">
        <DataTable
          v-if="products"
          scrollable
          v-model:filters="filters"
          :value="products"
          @row-click="({ data }) => goTo(data)"
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

          <!-- Hide prices if the user has not unlocked the app -->
          <Column v-if="isUnlocked" header="Price/Inch">
            <template #body="{ data }">
              <span v-if="data?.priceRange">
                {{
                  toMoney(
                    toPricePerInch(
                      +data.priceRange.minVariantPrice.amount,
                      'mm',
                    ),
                  )
                }}
              </span>

              <span v-else>-</span>
            </template>
          </Column>

          <Column header="Stock" #body="{ data }" style="min-width: 100px">
            <span
              v-if="data.totalInventoryInches > 0"
              class="text-sm font-light text-green-600"
            >
              {{ Math.floor(data.totalInventoryInches) }}" In Stock
            </span>

            <span
              v-else-if="data.totalInventory > 0"
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
import type { CollectionResponse } from '@/utils/types'
import { toPricePerInch, toMoney, toInches } from '@/utils/conversion'
import {
  navigateTo,
  computed,
  useLazyFetch,
  ref,
  useHead,
  useRoute,
  useFetch,
} from '#imports'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import { availableProductQuantity } from '@/utils/available-quantity'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const { isUnlocked } = storeToRefs(useCartStore())
const { params } = useRoute()

const handleMapping = {
  'alloy-20': { searchJobbossWith: 'ALLOY 20', replaceJobbossWith: 'Alloy 20' },
  'duplex-2205': {
    searchJobbossWith: 'DUPLEX 2205',
    replaceJobbossWith: 'Duplex 2205',
  },
  '316l': { searchJobbossWith: '316 SS', replaceJobbossWith: '316L SS' },
  '416': { searchJobbossWith: '416 SS', replaceJobbossWith: '416 SS' },
  '410': { searchJobbossWith: '410 SS', replaceJobbossWith: '410 SS' },
}
type HandleKey = keyof typeof handleMapping
const variables = computed(() => {
  const handle = (
    typeof params.handle === 'string' ? params.handle : params.handle[0]
  ) as HandleKey
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

const { data: jobbossData } = await useFetch<{ products: [] }>(
  'https://data.remtechalloys.com/remtech_alloys_inventory_levels.json',
  { lazy: true, server: false },
)

function naturalSort(a: string, b: string) {
  const a1 = a.split(' ').map((word) => {
    if (parseFloat(word)) return parseFloat(word)
    else return word
  })
  const b1 = b.split(' ').map((word) => {
    if (parseFloat(word)) return parseFloat(word)
    else return word
  })
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] < b1[i]) return -1
    if (a1[i] > b1[i]) return 1
  }
  return 0
}

const shopifyProducts = computed(() => {
  return (
    collection.value?.products.edges.map(({ node }) => ({
      ...node,
      totalInventory: availableProductQuantity(
        node.handle,
        node.totalInventory ?? 0,
      ),
    })) ?? []
  )
})

const jobbossProducts = computed(() => {
  const handle = variables.value.handle as HandleKey
  if (!handleMapping[handle]) return []

  return (
    jobbossData.value?.products
      .filter(
        (item: { partno: string; qtyonhand: number; partweight: number }) =>
          item.partno.startsWith(handleMapping[handle].searchJobbossWith),
      )
      .map(
        (item: { partno: string; qtyonhand: number; partweight: number }) => ({
          title: item.partno
            .replace(
              handleMapping[handle].searchJobbossWith,
              handleMapping[handle].replaceJobbossWith,
            )
            .replace(/RND/g, 'Diameter'),
          totalInventoryInches: item.qtyonhand,
        }),
      )
      .sort((a, b) => naturalSort(a.title, b.title)) ?? []
  )
})

const products = computed(() => {
  return [...shopifyProducts.value, ...jobbossProducts.value].sort((a, b) =>
    naturalSort(a.title, b.title),
  )
})

useHead({
  title: collection.value?.title,
})

/**
 * Go to the RFQ page if the user has not unlocked the app
 */
const goTo = async (data: any) => {
  if (isUnlocked.value && data.priceRange)
    await navigateTo(`/products/${data.handle}`)
  else await navigateTo(`/pages/rfq`)
}
</script>
