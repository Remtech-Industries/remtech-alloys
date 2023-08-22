<template>
  <div>{{ data }}</div>
</template>

<script setup lang="ts">
import { useFetch } from '#imports'

const { data } = useFetch('/api/hello')
</script>
