<template>
  <button
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ form: object }>()
</script>
