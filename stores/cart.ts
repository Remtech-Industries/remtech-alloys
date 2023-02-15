import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAddToCart, useGetCart, useRemoveFromCart } from '@/proxies/cart'
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

    // TODO: This need to be more robust, but it works for now
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

  async function removeFromCart(cartId: string, lineIds: string[]) {
    const response = await useRemoveFromCart(cartId, lineIds)
    cart.value = response
  }

  return { cart, itemCount, cartId, getCart, addToCart, removeFromCart }
})
