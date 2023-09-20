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
          <CartLineItem :line="item" />
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
import CartLineItem from '@/components/cart/CartLineItem.vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useHead, computed, onMounted, ref } from '#imports'
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

const toCheckoutLink = ref()
async function onClick() {
  await updatePoNumber()
  if (toCheckoutLink.value) toCheckoutLink.value.click()
}

function flush() {
  if (!cart.value) return
  updateCart(cartItems.value.map((item) => ({ id: item.id, quantity: 0 })))
}
</script>
