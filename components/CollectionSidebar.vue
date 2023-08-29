<template>
  <div class="flex w-64 flex-col border-r border-gray-300 p-6">
    <div
      class="mb-3 whitespace-nowrap border-b border-slate-300 font-thin text-slate-900"
    >
      Choose a material type
    </div>

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
import { collectionsQuery } from '@/utils/collections'
import { useFetch, computed } from '#imports'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import { CollectionsResponse } from '@/utils/types'

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const collections = computed(() => {
  return data.value?.data?.collections?.edges.map(({ node }) => node)
})
</script>
