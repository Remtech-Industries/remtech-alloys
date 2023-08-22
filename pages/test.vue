<template>
  <div>{{ data }}</div>
</template>

<script setup lang="ts">
import { useFetch } from '#imports'

const { data } = await useFetch('/api/shop')
</script>
