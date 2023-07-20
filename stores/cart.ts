import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Attribute,
  CartLineUpdateInput,
  CartLineInput,
  Cart,
} from '@/utils/storefront-api-types'
import {
  cartLinesUpdate,
  cartLinesAdd,
  useGetCart,
  cartAttributesUpdate,
} from '@/proxies/cart'
import { tokenHandles, poKey } from '@/utils/constants'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const cartId = computed(() => cart.value?.id)
  const po = ref<Attribute['value']>()

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

      if (c?.attributes) {
        po.value = c.attributes.find(({ key }) => key === poKey)?.value
      }
    }
  }

  async function updateCart(items: CartLineUpdateInput[]) {
    if (!cartId.value) return

    const { cart: c } = await cartLinesUpdate(cartId.value, items)

    cart.value = c
    po.value = c.attributes.find(({ key }) => key === poKey)?.value
  }

  async function addToCart(items: CartLineInput[]) {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const { cart: c } = await cartLinesAdd(items, cartId.value)
    window.localStorage.setItem('cartId', JSON.stringify(c.id))
    cart.value = c
    po.value = c.attributes.find(({ key }) => key === poKey)?.value
  }

  async function updatePoNumber(poNumber: string | null | undefined) {
    if (!cartId.value) return

    if (!poNumber) poNumber = '_'
    const { cart: c } = await cartAttributesUpdate(cartId.value, [
      { key: poKey, value: poNumber },
    ])

    cart.value = c
    po.value = c.attributes.find(({ key }) => key === poKey)?.value
  }

  return {
    cart,
    itemCount,
    cartId,
    getCart,
    addToCart,
    po,
    updatePoNumber,
    updateCart,
  }
})
