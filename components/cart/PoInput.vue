<template>
  <div class="mb-2 flex w-full">
    <div
      class="whitespace-nowrap rounded-l bg-slate-700 px-2 py-1 text-slate-50"
    >
      PO #
    </div>

    <input
      v-model="po"
      type="text"
      placeholder="(optional)"
      class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
      @blur="updatePoNumber(($event.target as HTMLInputElement)?.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { Mutation } from '@/utils/types'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { cartAttributesUpdateQuery } from '@/utils/cart'
import { poKey } from '@/utils/constants'

const { isPoUpdating, po, cartId, cart } = storeToRefs(useCartStore())

async function updatePoNumber(value: string) {
  if (!cartId.value) return

  isPoUpdating.value = true
  type Response = { data: Pick<Mutation, 'cartAttributesUpdate'> }
  const { data } = await $fetch<Response>(useShopifyUrl(), {
    ...useShopifyOptions(cartAttributesUpdateQuery, {
      cartId: cartId.value,
      attributes: [{ key: poKey, value: value || '_' }],
    }),
  }).finally(() => (isPoUpdating.value = false))

  if (data.cartAttributesUpdate) cart.value = data.cartAttributesUpdate.cart
}
</script>
