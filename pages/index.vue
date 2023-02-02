<template>
  <div class="flex">
    <CollectionSidebar />

    <table class="text-slate-700">
      <thead>
        <tr class="border-b">
          <th class="border-r py-1">Name</th>
          <th class="py-1"># of Products</th>
        </tr>
      </thead>

      <tbody>
        <tr class="border-b" v-for="{ node } in collections">
          <td class="border-r pr-6">
            <NuxtLink :to="`/collections/${node.handle}`">
              {{ node.title }}
            </NuxtLink>
          </td>
          <td>{{ node.products.edges.length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useGetCollections } from '~~/utils/get-collections'
import CollectionSidebar from '@/components/CollectionSidebar.vue'

const { collections } = await useGetCollections()
</script>
