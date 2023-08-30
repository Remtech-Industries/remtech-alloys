import { computed, ref } from '#imports'
import { defineStore } from 'pinia'
import type {
  Attribute,
  CartLineUpdateInput,
  CartLineInput,
  Cart,
  CartLinesUpdatePayload,
  CartLinesAddPayload,
  CartCreatePayload,
  Maybe,
} from '@/utils/storefront-api-types'
import { useGetCart, cartAttributesUpdate } from '@/proxies/cart'
import {
  cartCreateQuery,
  cartLinesAddQuery,
  cartLinesUpdateQuery,
} from '@/utils/cart'
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

    type Return = { data: { cartLinesUpdate: CartLinesUpdatePayload } }
    const { data } = await $fetch<Return>(useShopifyUrl(), {
      ...useShopifyOptions(cartLinesUpdateQuery, {
        cartId: cartId.value,
        lines: items,
      }),
    })

    if (data.cartLinesUpdate) cart.value = data.cartLinesUpdate.cart
    if (data.cartLinesUpdate) {
      po.value = data.cartLinesUpdate.cart?.attributes.find(
        ({ key }) => key === poKey,
      )?.value
    }
  }

  async function addItemsOrCreateCart(items: CartLineInput[]) {
    if (!cartId.value) {
      type Return = { data: { cartCreate: CartCreatePayload } }

      const { data } = await $fetch<Return>(useShopifyUrl(), {
        ...useShopifyOptions(cartCreateQuery, {
          cartId: cartId.value,
          lines: items,
        }),
      })
      return data.cartCreate.cart
    } else {
      type Return = { data: { cartLinesAdd: CartLinesAddPayload } }

      const { data } = await $fetch<Return>(useShopifyUrl(), {
        ...useShopifyOptions(cartLinesAddQuery, {
          cartId: cartId.value,
          lines: items,
        }),
      })
      return data.cartLinesAdd.cart
    }
  }

  async function addToCart(items: CartLineInput[]) {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const c = await addItemsOrCreateCart(items)
    if (!c) return

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
