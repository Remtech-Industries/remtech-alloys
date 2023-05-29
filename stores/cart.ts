import { computed, ref } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'
import { defineStore } from 'pinia'
import {
  useAddToCart,
  useGetCart,
  usePatchPoNumber,
  useRemoveFromCart,
} from '@/proxies/cart'
import type { Cart, CartLineInput } from '@/utils/types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const cartId = computed(() => cart?.value?.id)

  const itemCount = computed(() => {
    if (!cart.value) return 0
    return cart.value.lines.edges.length
  })

  async function getCart() {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const id = window.localStorage.getItem('cartId')
    const cartId = id ? JSON.parse(id) : null
    if (cartId) {
      const { cart: response } = await useGetCart(cartId)
      cart.value = response
    }
  }

  async function addToCart(items: CartLineInput[]) {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const response = await useAddToCart(items, cartId.value)
    window.localStorage.setItem('cartId', JSON.stringify(response.id))
    cart.value = response
  }

  async function removeFromCart(lineIds: string[]) {
    if (!cartId.value) return

    const response = await useRemoveFromCart(cartId.value, lineIds)
    cart.value = response
  }

  async function patchPoNumber(poNumber: string) {
    if (!cartId.value) return

    const response = await usePatchPoNumber(cartId.value, poNumber)
    cart.value = response
  }

  return {
    cart,
    itemCount,
    cartId,
    getCart,
    addToCart,
    removeFromCart,
    patchPoNumber,
  }
})
