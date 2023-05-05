<template>
  <div class="mx-auto flex max-w-2xl flex-col">
    <h1 class="mb-2 text-2xl font-bold">Cart</h1>

    <div class="mb-2 flex">
      <div
        class="whitespace-nowrap rounded-l bg-slate-700 px-2 py-1 text-slate-50"
      >
        PO #
      </div>

      <input
        ref="poNumberRef"
        v-model="po"
        type="text"
        placeholder="(optional, for reference only)"
        class="w-full rounded-r border px-2 py-1 shadow-inner focus:outline-none"
      />
    </div>

    <div
      v-for="item in cartItems"
      class="mb-4 flex flex-col gap-1 rounded border p-2"
      :key="item.id"
    >
      <CartLineItem
        :cart-line="item.parent"
        show-remove-button
        @click:remove="
          removeFromCart([item.id, ...item.children.map(({ id }) => id)])
        "
      />

      <div
        class="ml-8 divide-y divide-slate-300 border-l-8 border-slate-600 pl-4"
      >
        <CartLineItem
          v-for="child in item.children"
          :key="child.id"
          :cart-line="child"
        />
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
import CartLineItem from '@/components/CartLineItem.vue'
import { computed, onMounted, ref, onBeforeUnmount, watch } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead } from '#app'
import { useFocus } from '@vueuse/core'

const { cart } = storeToRefs(useCartStore())
const { removeFromCart, patchPoNumber } = useCartStore()

const po = ref(
  cart.value?.attributes.find((item) => item.key === 'PO #')?.value || ''
)

// Save value if the input loses focus
const poNumberRef = ref()
const { focused } = useFocus(poNumberRef)
watch(focused, (isFocused) => {
  if (!isFocused) patchPoNumber(po.value)
})

const cartItems = computed(() => {
  if (!cart.value) return []

  const nodes = cart.value.lines.edges.map(({ node }) => node)
  const parentItems = nodes.filter((node) => {
    const attributes = convertAttributesToObject(node.attributes)
    // not having a parent_id means it's a parent item
    return !attributes._parent_id
  })

  return parentItems.map((item) => {
    return {
      id: item.id,
      parent: item,
      children: nodes.filter((node) => {
        const attributes = convertAttributesToObject(node.attributes)
        // having a parent_id means it's a child item
        return attributes._parent_id === item.merchandise.id
      }),
    }
  })
})

const { getCart } = useCartStore()
onMounted(() => getCart())
useHead({ title: 'Cart' })
onBeforeUnmount(() => patchPoNumber(po.value))
</script>
