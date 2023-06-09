<template>
  <div class="mx-auto flex max-w-2xl flex-col" v-if="cart">
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

    <div
      v-for="item in cartItems"
      class="mb-4 flex flex-col gap-1 rounded border p-2"
    >
      <CartLineItem :cart-line="item" @click:remove="removeLine($event)" />
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
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead } from '#app'
import type { CartLine } from '@/utils/types'

const { cart } = storeToRefs(useCartStore())
const { patchPoNumber, updateCart, getCart } = useCartStore()

useHead({ title: 'Cart' })
onMounted(() => getCart())
onBeforeUnmount(() => patchPoNumber(po.value))

const cartItems = computed(() => {
  if (!cart.value) return []

  return cart.value.lines.edges.map(({ node }) => node)
})

const po = ref(
  cart.value?.attributes.find(({ key }) => key === 'PO #')?.value || ''
)
const toCheckoutLink = ref()
async function onClick() {
  await patchPoNumber(po.value)
  if (toCheckoutLink.value) toCheckoutLink.value.click()
}

const totalCutTokens = computed(() => {
  if (!cart.value) return 0

  return (
    cartItems.value.find(
      (item) => item.merchandise.product.handle === 'cut-token'
    )?.quantity || 0
  )
})

const totalHandlingTokens = computed(() => {
  if (!cart.value) return 0

  return (
    cartItems.value.find(
      (item) => item.merchandise.product.handle === 'handling-token'
    )?.quantity || 0
  )
})

function removeLine(line: CartLine) {
  if (!cart.value) return

  const cutTokenId =
    cartItems.value.find(
      (item) => item.merchandise.product.handle === 'cut-token'
    )?.id || ''

  const handlingTokenId =
    cartItems.value.find(
      (item) => item.merchandise.product.handle === 'handling-token'
    )?.id || ''

  const cutTokensToMinus = () => {
    return +(
      line.attributes.find((item) => item.key === '_cutTokens')?.value || 0
    )
  }

  const handlingTokensToMinus = () => {
    return +(
      line.attributes.find((item) => item.key === '_handlingTokens')?.value || 0
    )
  }

  updateCart([
    { id: line.id, quantity: 0 },
    {
      id: cutTokenId,
      quantity: totalCutTokens.value - cutTokensToMinus(),
    },
    {
      id: handlingTokenId,
      quantity: totalHandlingTokens.value - handlingTokensToMinus(),
    },
  ])
}

function flush() {
  if (!cart.value) return
  updateCart(cartItems.value.map((item) => ({ id: item.id, quantity: 0 })))
}
</script>
