<template>
  <div class="flex w-64 flex-col border-r border-gray-300 p-6">
    <div
      class="mb-3 whitespace-nowrap border-b border-slate-300 font-thin text-slate-900"
    >
      Choose a material type
    </div>

    <ul v-if="materials && materials.length > 0">
      <li v-for="title in materials" :key="title">
        <NuxtLink
          :to="`/collections/${title}`"
          class="block rounded px-2 py-2 text-slate-700 hover:bg-slate-100"
        >
          {{ title }}
        </NuxtLink>
      </li>
    </ul>

    <div v-else>Cannot seem to find any collections</div>
  </div>
</template>

<script setup lang="ts">
import { computed, storeToRefs } from '#imports'
import { useMaterialInfoStore } from '~/stores/material-info'

const { materialInfo } = storeToRefs(useMaterialInfoStore())
const materials = computed(() =>
  materialInfo.value?.material_groups.flatMap(({ materials }) =>
    materials.map(({ title }) => title),
  ),
)
</script>
