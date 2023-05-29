<template>
  <div class="mx-auto flex max-w-2xl flex-col">
    <h1 class="mb-2 font-oswald text-3xl font-bold">Cart</h1>

    <!-- po -->
    <div class="mb-2 flex w-96">
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
      />
    </div>

    {{ cart }}

    <div
      v-for="item in cartItems"
      class="mb-4 flex flex-col gap-1 rounded border p-2"
    >
      <CartLineItem
        :cart-line="item"
        @click:remove="removeFromCart([item.id])"
      />
    </div>

    <button
      class="rounded bg-slate-800 py-2 px-1 text-center text-slate-100"
      @click="onClick()"
    >
      Checkout
    </button>

    <a ref="toCheckoutLink" :href="cart?.checkoutUrl" />
  </div>
</template>

<script setup lang="ts">
import CartLineItem from '@/components/CartLineItem.vue'
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead } from '#app'

const { cart } = storeToRefs(useCartStore())
const { removeFromCart, patchPoNumber } = useCartStore()

const po = ref(
  cart.value?.attributes.find((item) => item.key === 'PO #')?.value || ''
)

const cartItems = computed(() => {
  if (!cart.value) return []

  return cart.value.lines.edges.map(({ node }) => node)
})

const { getCart } = useCartStore()
onMounted(() => getCart())
useHead({ title: 'Cart' })
onBeforeUnmount(() => patchPoNumber(po.value))

const toCheckoutLink = ref()
async function onClick() {
  await patchPoNumber(po.value)
  if (toCheckoutLink.value) toCheckoutLink.value.click()
}
</script>
