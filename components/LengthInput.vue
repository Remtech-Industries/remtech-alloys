<template>
  <div>
    <div class="flex">
      <div class="rounded-l bg-slate-600 px-2 py-1 text-slate-50">Length</div>

      <input
        type="number"
        step="any"
        class="w-full border px-2 py-1 shadow-inner focus:outline-none"
        :class="message ? 'border-red-500' : ''"
        @input="onInput($event)"
      />

      <div class="rounded-r bg-slate-600 px-2 py-1 text-slate-50">Inches</div>
    </div>

    <p v-if="message" class="ml-1 text-sm text-red-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toMm } from '@/utils/to-mm'

const message = ref('')

const emit = defineEmits<{
  (e: 'update:length', value: number): void
  (e: 'update:isValid', value: boolean): void
}>()

function onInput(event: Event) {
  message.value = ''
  const length = (event.target as HTMLInputElement).value

  if (length === '') {
    message.value = 'Length is required.'
    emit('update:isValid', false)
    return
  }

  if (+length <= 0) {
    message.value = 'Length must be greater than 0.'
    emit('update:isValid', false)
    return
  }

  emit('update:length', toMm(+length, 'inch'))
  emit('update:isValid', true)
}
</script>
