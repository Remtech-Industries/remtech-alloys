<template>
  <div class="mx-auto flex max-w-2xl flex-col">
    <h1 class="mb-2 text-2xl font-bold">Cart</h1>

    <div
      class="mb-4 flex flex-col gap-1 rounded border p-2"
      v-for="item in displayCart"
      :key="item.id"
    >
      <div class="flex justify-between gap-1">
        <div>
          <img
            v-if="item.parent.merchandise.image"
            :src="item.parent.merchandise.image?.url"
            :alt="item.parent.merchandise.image?.altText"
            width="64px"
          />

          <div>
            <p class="text-slate-800">
              {{ item.parent.merchandise.product.title }}
            </p>

            <p class="text-sm text-slate-500">
              {{ item.parent.merchandise.title }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <p class="self-center">
            {{ formatMoney(+item.parent.cost.totalAmount.amount) }}
          </p>

          <div class="self-center">
            <RemoveCartLineButton
              v-if="cart?.id"
              :cart-id="cart.id"
              :line-id="item.id"
            />
          </div>
        </div>
      </div>

      <div
        class="ml-8 divide-y divide-slate-300 border-l-8 border-slate-600 pl-4"
      >
        <div
          v-for="child in item.children"
          :key="child.id"
          class="flex justify-between gap-1"
        >
          <div>
            <img
              v-if="child.merchandise.image"
              :src="child.merchandise.image?.url"
              :alt="child.merchandise.image?.altText"
              width="64px"
            />

            <div>
              <p class="text-slate-800">
                {{ child.merchandise.product.title }}
              </p>

              <p class="text-sm text-slate-500">
                {{ child.merchandise.title }}
              </p>
            </div>
          </div>

          <p class="self-center">
            {{ formatMoney(+child.cost.totalAmount.amount) }}
          </p>
        </div>
      </div>
    </div>

    <NuxtLink
      :to="cart?.checkoutUrl"
      class="rounded bg-slate-800 py-2 px-1 text-center text-slate-100"
    >
      Checkout
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { formatMoney } from '@/utils/format-money'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead } from '#app'
import type { Attribute } from '@/utils/types'

const { cart } = storeToRefs(useCartStore())

function convertAttributesToObject(attributes: Attribute[]) {
  return attributes.reduce(
    (acc, attribute) => {
      return { ...acc, [attribute.key]: attribute.value }
    },
    { _parent_id: null }
  )
}

const displayCart = computed(() => {
  if (!cart.value) return []

  const nodes = cart.value.lines.edges.map(({ node }) => node)
  const parentItems = nodes.filter((node) => {
    const attributes = convertAttributesToObject(node.attributes)
    return !attributes._parent_id
  })

  return parentItems.map((item) => {
    return {
      id: item.id,
      parent: item,
      children: nodes.filter((node) => {
        const attributes = convertAttributesToObject(node.attributes)
        return attributes._parent_id === item.merchandise.id
      }),
    }
  })
})

const { getCart } = useCartStore()
onMounted(() => getCart())
useHead({ title: 'Cart' })
</script>
