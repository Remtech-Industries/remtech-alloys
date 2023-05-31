<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="m-6 w-full rounded-xl bg-white p-6">
      <table class="text-slate-700">
        <thead class="rounded">
          <tr class="border-b border-slate-300 bg-slate-100">
            <th class="p-3 text-left font-normal">Type</th>
            <th class="p-3 text-left font-normal">Qty. Types</th>
          </tr>
        </thead>

        <tbody>
          <tr class="border-b" v-for="{ node } in collections">
            <td class="border-r p-3">
              <NuxtLink :to="`/collections/${node.handle}`">
                {{ node.title }}
              </NuxtLink>
            </td>
            <td class="p-3">{{ node.products.edges.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetCollections } from '@/proxies/get-collections'
import CollectionSidebar from '@/components/CollectionSidebar.vue'

const { collections } = await useGetCollections()
</script>
