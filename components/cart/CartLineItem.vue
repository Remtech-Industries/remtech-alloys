<template>
  <div class="flex justify-between gap-1">
    <div class="flex-col gap-1">
      <p class="font-oswald text-xl text-slate-800">
        {{ line.merchandise.product.title }}
      </p>

      <div class="font-light" v-if="pieces">{{ pieces }}</div>
      <div class="font-light" v-if="tagNumber">Tag#: {{ tagNumber }}</div>
    </div>

    <div class="flex gap-2">
      <p class="self-center">
        {{ toMoney(+line.cost.totalAmount.amount) }}
      </p>

      <div class="self-center">
        <button
          v-if="!isAddon()"
          class="h-6 w-6 rounded-full bg-slate-800 text-center text-slate-100"
          @click="removeLine()"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { remainingTokenCalculator } from '@/components/cart/remainingTokenCalculator'
import { toMoney } from '@/utils/conversion'
import { useCartStore } from '@/stores/cart'
import type { BaseCartLine, Mutation } from '@/utils/storefront-api-types'
import { computed } from '#imports'
import { tokenHandles } from '@/utils/constants'
import { storeToRefs } from 'pinia'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import { cartLinesUpdateQuery } from '@/utils/cart'

// init
const props = defineProps<{ line: BaseCartLine }>()
const { cart, cartId } = storeToRefs(useCartStore())

// helper functions
const attributeValue = (key: string) => {
  return props.line.attributes.find((attribute) => attribute.key === key)?.value
}

const pieces = computed(() => attributeValue('Pieces'))
const tagNumber = computed(() => attributeValue('Tag#'))

function isAddon() {
  const handle = props.line.merchandise.product.handle
  return (tokenHandles as readonly string[]).includes(handle)
}

const cartItems = computed(() => {
  if (!cart.value) return []
  return cart.value.lines.edges.map(({ node }) => node)
})

async function removeLine() {
  const { remainingCutTokens, remainingHandlingTokens } =
    remainingTokenCalculator(props.line, cartItems.value)

  const items = [{ id: props.line.id, quantity: 0 }]
  if (remainingCutTokens.id) items.push(remainingCutTokens)
  if (remainingHandlingTokens.id) items.push(remainingHandlingTokens)

  const { data } = await $fetch<{ data: Pick<Mutation, 'cartLinesUpdate'> }>(
    useShopifyUrl(),
    {
      ...useShopifyOptions(cartLinesUpdateQuery, {
        cartId: cartId.value,
        lines: items,
      }),
    },
  )

  if (data?.cartLinesUpdate) cart.value = data.cartLinesUpdate.cart
}
</script>
