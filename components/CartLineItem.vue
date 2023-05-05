<template>
  <div class="flex justify-between gap-1">
    <div class="flex-col gap-1">
      <p class="text-slate-800">
        {{ cartLine.merchandise.product.title }}
      </p>

      <p class="text-sm text-slate-500">
        {{ cartLine.merchandise.title }}
      </p>

      <div v-if="pieces">{{ pieces }}</div>
    </div>

    <div class="flex gap-2">
      <p class="self-center">
        {{ formatMoney(+cartLine.cost.totalAmount.amount) }}
      </p>

      <div class="self-center" v-if="showRemoveButton">
        <button
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
import { formatMoney } from '@/utils/format-money'
import type { CartLine } from '@/utils/types'
import { computed } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'

const props = withDefaults(
  defineProps<{ cartLine: CartLine; showRemoveButton?: boolean }>(),
  {
    showRemoveButton: false,
  }
)

const emit = defineEmits<{ (e: 'click:remove'): void }>()

const pieces = computed(() => {
  const attributes = convertAttributesToObject(props.cartLine.attributes)
  return attributes['Pieces']
})
</script>
