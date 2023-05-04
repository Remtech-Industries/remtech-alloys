import { computed, ref } from 'vue'
import { convertAttributesToObject } from '@/utils/convert-attributes-to-object'
import { defineStore } from 'pinia'
import { useAddToCart, useGetCart, useRemoveFromCart } from '@/proxies/cart'
import type { Cart, CartLineInput } from '@/utils/types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const cartId = computed(() => cart?.value?.id)
  const poNumber = ref('')

  const itemCount = computed(() => {
    if (!cart.value) return 0

    return cart.value.lines.edges.filter(
      ({ node }) => !convertAttributesToObject(node.attributes)._parent_id
    ).length
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

  return {
    cart,
    poNumber,
    itemCount,
    cartId,
    getCart,
    addToCart,
    removeFromCart,
  }
})
