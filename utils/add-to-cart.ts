import { usePostToShopify } from './post-to-shopify'
import { useCartStore } from '~~/stores/cart'
import type { Cart, CartLineItem } from '~~/utils/types'

const createQuery = `
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
    }
  }
}
`

const addLineQuery = `
mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
    }
  }
}
`

export async function useAddToCart(items: CartLineItem[]): Promise<Cart> {
  const { cartId } = useCartStore()
  if (cartId) {
    const cart = await usePostToShopify(addLineQuery, {
      cartId,
      lines: items,
    })

    return cart.cartLinesAdd.cart
  } else {
    // create new cart
    const cart = await usePostToShopify(createQuery, {
      cartInput: {
        lines: items,
      },
    })

    return cart.cartCreate.cart
  }
}
