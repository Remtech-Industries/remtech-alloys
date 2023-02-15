<template>
  <div class="flex w-52 flex-col border-r border-gray-300 p-2">
    <div class="mb-2 border-b border-slate-300 font-thin text-slate-900">
      Choose a material type
    </div>

    <ul class="space-y-3 border-l border-slate-100">
      <li
        v-for="{ node } in collections"
        :key="node.id"
        class="border-l border-transparent pl-4 text-slate-700 hover:border-slate-400"
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

const { collections } = await useGetCollections()
</script>
