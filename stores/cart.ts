import { computed, ref } from '#imports'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { cartLinesAdd } from '@/proxies/cart'
import { getCartQuery } from '@/utils/cart'
import { poKey, tokenHandles } from '@/utils/constants'
import type {
  Cart,
  CartLineInput,
  Maybe,
  QueryRoot,
} from '@/utils/storefront-api-types'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Maybe<Cart>>()
  const cartId = computed(() => cart.value?.id)
  const po = computed({
    get() {
      return cart.value?.attributes.find(({ key }) => key === poKey)?.value
    },
    set(newValue) {
      if (!cart.value) return
      const poAttribute = cart.value.attributes.find(({ key }) => key === poKey)
      if (poAttribute) {
        poAttribute.value = newValue
      } else {
        cart.value.attributes.push({ key: poKey, value: newValue })
      }
    },
  })
  const isPoUpdating = ref(false)

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
      const { data } = await $fetch<{ data: Pick<QueryRoot, 'cart'> }>(
        useShopifyUrl(),
        {
          ...useShopifyOptions(getCartQuery, { cartId }),
        },
      )

      if (data.cart) cart.value = data.cart
    }
  }

  async function addToCart(items: CartLineInput[]) {
    if (!process.client) return //window will return undefined on server, errors with nitro server

    const { cart: c } = await cartLinesAdd(items, cartId.value)
    window.localStorage.setItem('cartId', JSON.stringify(c.id))
    cart.value = c
  }

  return {
    cart,
    itemCount,
    cartId,
    getCart,
    addToCart,
    po,
    isPoUpdating,
  }
})
