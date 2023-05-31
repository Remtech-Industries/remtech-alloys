<template>
  <div class="flex w-60 flex-col border-r border-gray-300 p-6">
    <div class="mb-3 border-b border-slate-300 font-thin text-slate-900">
      Choose a material type
    </div>

    <ul>
      <li
        v-for="{ node } in collections"
        :key="node.id"
        class="rounded px-2 py-2 text-slate-700 hover:bg-slate-100"
      >
        <NuxtLink :to="`/collections/${node.handle}`">
          {{ node.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useGetCollections } from '@/proxies/get-collections'

const collections = await useGetCollections()
</script>
