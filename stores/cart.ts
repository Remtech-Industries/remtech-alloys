import { defineStore } from 'pinia'
import { ref, Ref, computed } from 'vue'
import { useGetCart } from '../utils/get-cart'
import { useAddToCart } from '~~/utils/add-to-cart'
import type { Cart, CartLine } from '~~/utils/types'

export const useCartStore = defineStore('cart', () => {
  const cart: Ref<Cart> = ref({})
  const cartId = computed(() => cart.value.id)

  const itemCount = computed(() => {
    if (!cart.value.lines) return 0
    return cart.value.lines.edges.length
  })

  async function getCart() {
    if (!process.client) return

    const id = window.localStorage.getItem('cartId')
    const cartId = id ? JSON.parse(id) : null
    if (cartId) {
      const { cart: response } = await useGetCart(cartId)
      cart.value = response
    }
  }

  async function addToCart(items: CartLine[]) {
    const response = await useAddToCart(items, cartId.value)
    if (process.client) {
      window.localStorage.setItem('cartId', JSON.stringify(response.id))
    }
    cart.value = response
  }
  return { cart, itemCount, cartId, getCart, addToCart }
})
