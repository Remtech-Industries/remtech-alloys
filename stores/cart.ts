import { computed, ref } from '#imports'
import { defineStore } from 'pinia'
import type {
  Attribute,
  CartLineUpdateInput,
  CartLineInput,
  Cart,
  CartLinesUpdatePayload,
  Maybe
} from '@/utils/storefront-api-types'
import {
  cartLinesAdd,
  useGetCart,
  cartAttributesUpdate,
} from '@/proxies/cart'
import { cartLinesUpdateQuery } from '@/utils/cart'
import { tokenHandles, poKey } from '@/utils/constants'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Maybe<Cart>>()
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

    const { data } = await $fetch<{ data: { cartLinesUpdate: CartLinesUpdatePayload } }>(useShopifyUrl(), {
      ...useShopifyOptions(cartLinesUpdateQuery, { cartId: cartId.value, lines: items }),
    })

    if (data.cartLinesUpdate) cart.value = data.cartLinesUpdate.cart
    if (data.cartLinesUpdate) po.value = data.cartLinesUpdate.cart?.attributes.find(({ key }) => key === poKey)?.value
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
