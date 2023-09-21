import { computed, ref } from '#imports'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { cartLinesAdd } from '@/proxies/cart'
import { cartAttributesUpdateQuery, getCartQuery } from '@/utils/cart'
import { poKey, tokenHandles } from '@/utils/constants'
import type {
  Attribute,
  Cart,
  CartLineInput,
  Maybe,
  QueryRoot,
  Mutation,
} from '@/utils/storefront-api-types'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Maybe<Cart>>()
  const cartId = computed(() => cart.value?.id)
  const po = ref<Attribute['value']>()

  const itemCount = computed(() => {
    if (!cart.value) return 0

    const nonTokenItems = cart.value.lines.edges.filter(({ node }) => {
      const handle = node.merchandise.product.handle
      return !(tokenHandles as readonly string[]).includes(handle)
    })

    return nonTokenItems?.length || 0
  })

  async function getCart() {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const id = window.localStorage.getItem('cartId')
    const cartId = id ? JSON.parse(id) : null
    if (cartId) {
      const { data } = await $fetch<{ data: Pick<QueryRoot, 'cart'> }>(useShopifyUrl(), {
        ...useShopifyOptions(getCartQuery, { cartId, }),
      })

      if (data.cart) cart.value = data.cart
      if (data.cart?.attributes) {
        po.value = data.cart.attributes.find(({ key }) => key === poKey)?.value
      }
    }
  }

  async function addToCart(items: CartLineInput[]) {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const { cart: c } = await cartLinesAdd(items, cartId.value)
    window.localStorage.setItem('cartId', JSON.stringify(c.id))
    cart.value = c
    po.value = c.attributes.find(({ key }) => key === poKey)?.value
  }

  async function updatePoNumber() {
    if (!cartId.value) return

    type Response = { data: Pick<Mutation, 'cartAttributesUpdate'> }
    const { data } = await $fetch<Response>(useShopifyUrl(), {
      ...useShopifyOptions(cartAttributesUpdateQuery, {
        cartId: cartId.value,
        attributes: [{ key: poKey, value: po.value || '_' }],
      }),
    })

    if (data.cartAttributesUpdate) cart.value = data.cartAttributesUpdate.cart
    if (data.cartAttributesUpdate) {
      po.value = data.cartAttributesUpdate.cart?.attributes.find(
        ({ key }) => key === poKey,
      )?.value
    }
  }

  return {
    cart,
    itemCount,
    cartId,
    getCart,
    addToCart,
    po,
    updatePoNumber,
  }
})
