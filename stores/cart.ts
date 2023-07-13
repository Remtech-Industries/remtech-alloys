import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  CartLineUpdateInput,
  CartLineInput,
} from '@/utils/storefront-api-types'
import {
  cartLinesUpdate,
  useAddToCart,
  useGetCart,
  cartAttributesUpdate,
  useRemoveFromCart,
} from '@/proxies/cart'
import type { Cart } from '@/utils/types'
import { tokenHandles } from '@/utils/constants'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const cartId = computed(() => cart?.value?.id)
  const po = ref<string | undefined>()

  const itemCount = computed(() => {
    if (!cart.value) return 0

    const nonTokenItems = cart.value.lines.edges.filter(({ node }) => {
      const handle = node.merchandise.product.handle as
        | 'cut-token'
        | 'handling-token'
      return !tokenHandles.includes(handle)
    })

    return nonTokenItems?.length || 0
  })

  async function getCart() {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const id = window.localStorage.getItem('cartId')
    const cartId = id ? JSON.parse(id) : null
    if (cartId) {
      const { cart: c } = await useGetCart(cartId)
      cart.value = c
      po.value = c.attributes.find(({ key }) => key === 'PO #')?.value
    }
  }

  async function updateCart(items: CartLineUpdateInput[]) {
    if (!cartId.value) return

    const { cart: c } = await cartLinesUpdate(cartId.value, items)

    cart.value = c
    po.value = c.attributes.find(({ key }) => key === 'PO #')?.value
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

  async function updatePoNumber(poNumber: string) {
    if (!cartId.value) return

    const { cart: c } = await cartAttributesUpdate(cartId.value, [
      { key: 'PO #', value: poNumber },
    ])

    cart.value = c
    po.value = c.attributes.find(({ key }) => key === 'PO #')?.value
  }

  return {
    cart,
    itemCount,
    cartId,
    getCart,
    addToCart,
    po,
    removeFromCart,
    updatePoNumber,
    updateCart,
  }
})
