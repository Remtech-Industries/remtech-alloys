import { usePostToShopify } from './post-to-shopify'
import type { Cart, CartLine, CartLineInput } from '@/utils/types'

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
            image {
              url
              altText
            }
            product {
              title
            }
            addonType: metafield(namespace: "custom", key: "addon_type") {
              value
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
        attributes {
          key
          value
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

export async function useAddToCart(items: CartLineInput[], cartId?: string) {
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

export async function useRemoveFromCart(cartId: string, lineId: string) {
  const response = await usePostToShopify(
    `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart ${cart}
      }
    }
  `,
    { cartId, lineIds: [lineId] }
  )

  return response.cartLinesRemove.cart
}
