<template>
  <div class="mx-auto mt-6 max-w-3xl text-slate-600">
    <h1
      class="mb-2 border-b-2 border-yellow-500 font-oswald text-3xl font-bold"
    >
      Cart
    </h1>

    <div v-if="cartItems.length === 0" class="text-2xl">Cart is empty.</div>

    <div class="flex gap-3" v-if="cartItems.length">
      <div class="w-4/6">
        <div v-for="item in cartItems" class="mb-4 flex flex-col border-b p-2">
          <CartLineItem :cart-line="item" @click:remove="removeLine($event)" />
        </div>
      </div>

      <div class="w-2/6 rounded-lg bg-slate-200 p-3 shadow">
        <PoInput />

        <div
          class="flex justify-between"
          v-if="
            cart?.cost.subtotalAmount.amount !== cart?.cost.totalAmount.amount
          "
        >
          <div class="font-light">Subtotal</div>
          <div v-if="cart?.cost.subtotalAmount">
            {{ toMoney(+cart?.cost.subtotalAmount.amount) }}
          </div>
        </div>

        <div class="flex justify-between" v-if="cart?.cost.totalTaxAmount">
          <div class="font-light">Taxes</div>
          <div>
            {{ toMoney(+cart?.cost.totalTaxAmount.amount) }}
          </div>
        </div>

        <div class="flex justify-between" v-if="cart?.cost.totalAmount">
          <div class="font-light">Total Amount</div>
          <div>
            <span class="mr-1 text-xs font-light text-slate-500">
              {{ cart?.cost.totalAmount.currencyCode }}
            </span>
            <span class="font-bold text-slate-700">
              {{ toMoney(+cart?.cost.totalAmount.amount) }}
            </span>
          </div>
        </div>

        <ClientOnly>
          <button
            class="mt-3 w-full rounded bg-yellow-500 p-2 text-center text-slate-900 hover:bg-yellow-400 hover:text-slate-700"
            @click="onClick()"
          >
            Checkout
          </button>

          <a ref="toCheckoutLink" :href="cart?.checkoutUrl" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartLineItem from '@/components/CartLineItem.vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead, computed, onMounted, ref } from '#imports'
import type { BaseCartLine } from '@/utils/storefront-api-types'
import { tokenHandles } from '@/utils/constants'
import { toMoney } from '@/utils/conversion'
import PoInput from '~/components/cart/PoInput.vue'

const { cart } = storeToRefs(useCartStore())
const { updatePoNumber, updateCart, getCart } = useCartStore()

useHead({ title: 'Cart' })
onMounted(() => getCart())

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
  await updatePoNumber()
  if (toCheckoutLink.value) toCheckoutLink.value.click()
}

const cutTokens = computed(() => {
  const item = cartItems.value.find(
    ({ merchandise }) => merchandise.product.handle === 'cut-token',
  )

  return { quantity: item?.quantity || 0, id: item?.id || '' }
})

const handlingTokens = computed(() => {
  const item = cartItems.value.find(
    ({ merchandise }) => merchandise.product.handle === 'handling-token',
  )

  return { quantity: item?.quantity || 0, id: item?.id || '' }
})

const isLastItem = computed(() => productItems.value.length <= 1)

function removeLine(line: BaseCartLine) {
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
