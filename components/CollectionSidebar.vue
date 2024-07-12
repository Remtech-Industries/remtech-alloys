<template>
  <div class="flex w-64 flex-col border-r border-gray-300 p-6">
    <div
      class="mb-3 whitespace-nowrap border-b border-slate-300 font-thin text-slate-900"
    >
      Choose a material type
    </div>

    <ul v-if="collections && collections.length > 0">
      <li v-for="collection in collections" :key="collection.handle">
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
import { handleMapping } from '@/utils/handle-mapping'

const { data } = await useFetch<CollectionsResponse>(useShopifyUrl(), {
  ...useShopifyOptions(collectionsQuery),
  key: 'collections',
})

const staticCollections = computed(() =>
  Object.entries(handleMapping).map(([handle, strings]) => ({
    handle,
    title: strings.displayTitle,
  })),
)

const collections = computed(() => {
  if (!data.value?.data?.collections?.edges) return staticCollections.value

  const allCollections = staticCollections.value

  data.value.data.collections.edges.forEach(({ node }) => {
    if (
      !allCollections.some((collection) => node.handle === collection.handle)
    ) {
      allCollections.push(node)
    }
  })

  return allCollections.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  )
})
</script>
