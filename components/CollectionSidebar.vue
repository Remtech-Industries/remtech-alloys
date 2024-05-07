<template>
  <div class="flex w-64 flex-col border-r border-gray-300 p-6">
    <div
      class="mb-3 whitespace-nowrap border-b border-slate-300 font-thin text-slate-900"
    >
      Choose a material type
    </div>

    <NuxtLink
      to="/material-type/alloy_20"
      class="block rounded px-2 py-2 text-slate-700 hover:bg-slate-100"
    >
      Alloy 20
    </NuxtLink>

    <ul v-if="collections && collections.length > 0">
      <li v-for="collection in collections" :key="collection.id">
        <NuxtLink
          :to="`/collections/${collection.handle}`"
          class="block rounded px-2 py-2 text-slate-700 hover:bg-slate-100"
        >
          {{ collection.title }}
        </NuxtLink>
      </li>
    </ul>

    <div v-else>Cannot seem to find any collections</div>
  </div>
</template>

<script setup lang="ts">
import { computed, useFetch } from '#imports'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { collectionsQuery } from '@/utils/collections'
import { CollectionsResponse } from '@/utils/types'

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const collections = computed(() => {
  return data.value?.data?.collections?.edges.map(({ node }) => node)
})
</script>
