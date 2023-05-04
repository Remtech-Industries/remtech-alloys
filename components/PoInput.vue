<template>
  <div class="flex">
    <div
      class="whitespace-nowrap rounded-l bg-slate-700 px-2 py-1 text-slate-50"
    >
      PO #
    </div>

    <input
      type="text"
      placeholder="(optional, for reference only)"
      class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
      @input="emit('update', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'update', value: string): void }>()
</script>
