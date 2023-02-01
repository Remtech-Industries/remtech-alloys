<template>
  <div>
    <div class="flex">
      <div class="rounded-l bg-slate-700 px-2 py-1 text-slate-50">Length</div>
      <input
        v-model="length"
        type="number"
        class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
        :class="lengthState ? 'border-red-500' : ''"
      />
    </div>

    <p class="ml-1 text-sm text-red-500">
      {{ lengthState }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

const length: Ref<number | string> = ref(1)
const lengthState = computed(() => {
  if (length.value === '') return 'Length is required.'
  if (length.value <= 0) return 'Length must be more than 0.'
  return ''
})
</script>
