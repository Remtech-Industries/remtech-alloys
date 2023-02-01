<template>
  <div>
    <div class="flex">
      <div class="rounded-l bg-slate-700 px-2 py-1 text-slate-50">Quantity</div>
      <input
        :value="value"
        type="number"
        class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
        :class="!isValid ? 'border-red-500' : ''"
        @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <p v-if="!isValid" class="ml-1 text-sm text-red-500">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  value: number | string
  isValid: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number | string): void
  (e: 'update:isValid', value: boolean): void
}>()

const message = computed(() => {
  if (props.value === '') return 'Quantity is required.'
  if (props.value <= 0) return 'Quantity must be more than 0.'
  if (parseInt(`${props.value}`) !== props.value)
    return 'Quantity must be a whole number.'
  return ''
})

watch(message, () => emit('update:isValid', !message.value))
</script>
