<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="w-full p-6" v-if="collection">
      <div class="mb-6 flex items-baseline">
        <h1
          class="border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          {{ collection.title }}
        </h1>

        <p class="pl-4 text-sm font-thin">{{ collection.description }}</p>
      </div>

      <div class="rounded-xl bg-white p-6">
        <DataTable
          row-hover
          class="p-datatable-sm"
          :value="products.map(({ node }) => node)"
          @row-click="({ data }) => $router.push(`/products/${data.handle}`)"
        >
          <Column field="title" header="Size" />
          <Column header="Price/Inch">
            <template #body="{ data }">
              {{
                toMoney(
                  toPricePerInch(+data.priceRange.minVariantPrice.amount, 'mm')
                )
              }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGetCollection } from '@/proxies/get-collection'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import type { ProductEdge, Collection } from '@/utils/storefront-api-types'
import { toPricePerInch, toMoney } from '@/utils/conversion'
const { params } = useRoute()

const collection = ref<Collection | null>(null)
const products = ref<ProductEdge[]>([])

onMounted(async () => {
  const handle =
    typeof params.handle === 'string' ? params.handle : params.handle[0] || ''
  const response = await useGetCollection(handle)
  collection.value = response.collection
  products.value = response.collection.products.edges
})
</script>
