<template>
  <div class="flex">
    <div class="rounded-l bg-slate-700 px-2 py-1 text-slate-50">Quantity</div>

    <input
      type="number"
      class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
      :class="message ? 'border-red-500' : ''"
      @input="onInput($event)"
    />
  </div>

  <p v-if="message" class="ml-1 text-sm text-red-500">{{ message }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void
  (e: 'update:isValid', value: boolean): void
}>()

function onInput(event: Event) {
  message.value = ''
  const quantity = (event.target as HTMLInputElement).value

  if (quantity === '') {
    message.value = 'Quantity is required.'
    emit('update:isValid', false)
    return
  }

  if (+quantity <= 0) {
    message.value = 'Quantity must be greater than 0.'
    emit('update:isValid', false)
    return
  }

  emit('update:quantity', +quantity)
  emit('update:isValid', true)
}
</script>
