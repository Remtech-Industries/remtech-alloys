import { usePostToShopify } from './post-to-shopify'
import type { Cart, CartLine } from '~~/utils/types'

const cart = `
{ 
  id
  checkoutUrl
  cost {
    totalAmount {
      amount
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
  }
}`

const createQuery = `
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart ${cart}
  }
}`

const addLineQuery = `
mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart ${cart}
  }
}`

const getCartQuery = `query getCart($cartId: ID!) { cart(id: $cartId) ${cart} }`

export async function useAddToCart(items: CartLine[], cartId?: string) {
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

export async function useGetCart(cartId: string) {
  const { cart } = await usePostToShopify(getCartQuery, { cartId: cartId })
  return { cart }
}
