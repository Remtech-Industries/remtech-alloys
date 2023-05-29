<template>
  <div class="flex justify-between gap-1">
    <div class="flex-col gap-1">
      <p class="font-oswald text-xl text-slate-800">
        {{ cartLine.merchandise.product.title }}
      </p>

      <div v-if="pieces">{{ pieces }}</div>
    </div>

    <div class="flex gap-2">
      <p class="self-center">
        {{ toMoney(+cartLine.cost.totalAmount.amount) }}
      </p>

      <div class="self-center">
        <button
          v-if="!isAddon()"
          class="h-6 w-6 rounded-full bg-slate-800 text-center text-slate-100"
          @click="emit('click:remove')"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toMoney } from '@/utils/to-money'
import type { CartLine } from '@/utils/types'
import { computed } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'

const props = defineProps<{ cartLine: CartLine }>()

const emit = defineEmits<{ (e: 'click:remove'): void }>()

const pieces = computed(() => {
  const attributes = convertAttributesToObject(props.cartLine.attributes)
  return attributes['Pieces']
})

function isAddon() {
  const handle = props.cartLine.merchandise.product.handle
  return ['cut-token', 'handling-token'].includes(handle)
}
</script>
