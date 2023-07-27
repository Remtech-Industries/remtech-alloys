<template>
  <div class="flex justify-between gap-1">
    <div class="flex-col gap-1">
      <p class="font-oswald text-xl text-slate-800">
        {{ cartLine.merchandise.product.title }}
      </p>

      <div class="font-light" v-if="pieces">{{ pieces }}</div>
      <div class="font-light" v-if="tagNumber">Tag#: {{ tagNumber }}</div>
    </div>

    <div class="flex gap-2">
      <p class="self-center">
        {{ toMoney(+cartLine.cost.totalAmount.amount) }}
      </p>

      <div class="self-center">
        <button
          v-if="!isAddon()"
          class="h-6 w-6 rounded-full bg-slate-800 text-center text-slate-100"
          @click="emit('click:remove', cartLine)"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toMoney } from '@/utils/conversion'
import type { BaseCartLine } from '@/utils/storefront-api-types'
import { computed } from '#imports'

const props = defineProps<{ cartLine: BaseCartLine }>()

const emit = defineEmits<{ (e: 'click:remove', value: BaseCartLine): void }>()

const pieces = computed(() => {
  return props.cartLine.attributes.find(({ key }) => key === 'Pieces')?.value
})

const tagNumber = computed(() => {
  return props.cartLine.attributes.find(({ key }) => key === 'Tag#')?.value
})

function isAddon() {
  const handle = props.cartLine.merchandise.product.handle
  return ['cut-token', 'handling-token'].includes(handle)
}
</script>
