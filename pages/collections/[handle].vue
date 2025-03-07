<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div v-if="collection" class="w-full p-6">
      <div class="mb-6 flex flex-col items-baseline">
        <h1
          class="mb-3 border-b-4 border-yellow-500 text-center font-oswald text-3xl font-bold text-slate-600"
        >
          {{ collection.title }}
        </h1>

        <p v-if="collection.description" class="pl-4 text-sm font-light">
          {{ collection.description }}
        </p>
      </div>

      <div class="rounded-xl bg-white p-6">
        <DataTable
          v-if="collection.parts.length"
          scrollable
          v-model:filters="filters"
          :value="collection.parts"
          data-key="partno"
        >
          <template #header>
            <div class="flex justify-end">
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </div>
          </template>

          <Column
            field="partno"
            frozen
            header="Size"
            style="min-width: 180px"
          />

          <Column header="Stock" #body="{ data }" style="min-width: 100px">
            <span
              v-if="data.total_quantity > 0"
              class="text-sm font-light text-green-600"
            >
              {{ Math.floor(data.total_quantity) }}" In Stock
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
import { FilterMatchMode } from '@primevue/core/api'
import CollectionSidebar from '@/components/CollectionSidebar.vue'
import {
  computed,
  ref,
  useHead,
  useRoute,
  useMaterialInfoStore,
} from '#imports'
import { storeToRefs } from 'pinia'

const { params } = useRoute()

const variables = computed(() => {
  const handle =
    typeof params.handle === 'string' ? params.handle : params.handle[0]
  return { handle }
})

const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS,
  },
})

const { materialInfo } = storeToRefs(useMaterialInfoStore())
const collection = computed(() => {
  return materialInfo.value?.material_groups
    .find(({ materials }) =>
      materials.some(({ title }) => title === variables.value.handle),
    )
    ?.materials.find(({ title }) => title === variables.value.handle)
})

useHead({ title: collection.value?.title })
</script>
