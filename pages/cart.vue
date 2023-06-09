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

    <div v-for="item in cartItems" class="mb-4 flex flex-col border-b p-2">
      <CartLineItem :cart-line="item" @click:remove="removeLine($event)" />
    </div>

    <button
      class="rounded bg-slate-700 py-2 px-1 text-center text-slate-200 hover:bg-yellow-500 hover:text-slate-700"
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
import { tokenHandles } from '@/utils/constants'

const { cart } = storeToRefs(useCartStore())
const { patchPoNumber, updateCart, getCart } = useCartStore()

useHead({ title: 'Cart' })
onMounted(() => getCart())
onBeforeUnmount(() => patchPoNumber(po.value))

const cartItems = computed(() => {
  if (!cart.value) return []

  return cart.value.lines.edges.map(({ node }) => node)
})

const productItems = computed(() => {
  return cartItems.value.filter(({ merchandise }) => {
    const handle = merchandise.product.handle
    return !tokenHandles.includes(handle)
  })
})

const po = ref(
  cart.value?.attributes.find(({ key }) => key === 'PO #')?.value || ''
)
const toCheckoutLink = ref()
async function onClick() {
  await patchPoNumber(po.value)
  if (toCheckoutLink.value) toCheckoutLink.value.click()
}

const cutTokens = computed(() => {
  const item = cartItems.value.find(
    ({ merchandise }) => merchandise.product.handle === 'cut-token'
  )

  return { quantity: item?.quantity || 0, id: item?.id || '' }
})

const handlingTokens = computed(() => {
  const item = cartItems.value.find(
    ({ merchandise }) => merchandise.product.handle === 'handling-token'
  )

  return { quantity: item?.quantity || 0, id: item?.id || '' }
})

const isLastItem = computed(() => productItems.value.length <= 1)

function removeLine(line: CartLine) {
  if (!cart.value) return

  const remainingCutTokens = () => {
    const cutTokensOnItem =
      line.attributes.find(({ key }) => key === '_cutTokens')?.value || 0

    let quantity
    if (isLastItem.value) {
      quantity = 0
    } else {
      quantity = cutTokens.value.quantity - +cutTokensOnItem
    }

    return { id: cutTokens.value.id, quantity }
  }

  const remainingHandlingTokens = () => {
    const handlingTokensOnItem =
      line.attributes.find(({ key }) => key === '_handlingTokens')?.value || 0

    let quantity
    if (isLastItem.value) {
      quantity = 0
    } else {
      quantity = handlingTokens.value.quantity - +handlingTokensOnItem
    }

    return { id: handlingTokens.value.id, quantity }
  }

  updateCart([
    { id: line.id, quantity: 0 },
    remainingCutTokens(),
    remainingHandlingTokens(),
  ])
}

function flush() {
  if (!cart.value) return
  updateCart(cartItems.value.map((item) => ({ id: item.id, quantity: 0 })))
}
</script>
