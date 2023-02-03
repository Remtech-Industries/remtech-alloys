import { defineStore } from 'pinia'
import { ref, Ref, computed } from 'vue'
import { useGetCart } from '../utils/get-cart'
import { useAddToCart } from '~~/utils/add-to-cart'
import type { Cart, CartLineItem } from '~~/utils/types'

export const useCartStore = defineStore('cart', () => {
  const cart: Ref<Cart> = ref({})
  const cartId = computed(() => cart.value.id)

  async function getCart(): Promise<void> {
    if (!cartId.value) return
    const { cart: response } = await useGetCart(cartId.value)
    if (process.client) {
      window.localStorage.setItem('cart', JSON.stringify(response))
    }
    cart.value = response
  }

  async function addToCart(items: CartLineItem[]): Promise<void> {
    const response = await useAddToCart(items)
    if (process.client) {
      window.localStorage.setItem('cart', JSON.stringify(response))
    }
    cart.value = response
  }
  return { cart, cartId, getCart, addToCart }
})
