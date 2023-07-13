<template>
  <div class="mx-auto max-w-3xl" v-if="cart">
    <h1
      class="mb-2 border-b-2 border-yellow-500 font-oswald text-3xl font-bold"
    >
      Cart
    </h1>

    <div class="flex gap-3">
      <div class="w-4/6">
        <div v-for="item in cartItems" class="mb-4 flex flex-col border-b p-2">
          <CartLineItem :cart-line="item" @click:remove="removeLine($event)" />
        </div>
      </div>

      <div class="w-2/6">
        <!-- po -->
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
          />
        </div>

        <button
          class="w-full rounded bg-yellow-500 p-2 text-center text-slate-900 hover:bg-yellow-400 hover:text-slate-700"
          @click="onClick()"
        >
          Checkout
        </button>

        <a ref="toCheckoutLink" :href="cart?.checkoutUrl" />
      </div>
    </div>
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

const { cart, po } = storeToRefs(useCartStore())
const { updatePoNumber, updateCart, getCart } = useCartStore()

useHead({ title: 'Cart' })
onMounted(() => getCart())
onBeforeUnmount(async () => {
  if (po.value) updatePoNumber(po.value)
})

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

const toCheckoutLink = ref()
async function onClick() {
  if (po.value) await updatePoNumber(po.value)
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

  const items = [{ id: line.id, quantity: 0 }]
  if (remainingCutTokens().id) items.push(remainingCutTokens())
  if (remainingHandlingTokens().id) items.push(remainingHandlingTokens())

  updateCart(items)
}

function flush() {
  if (!cart.value) return
  updateCart(cartItems.value.map((item) => ({ id: item.id, quantity: 0 })))
}
</script>
