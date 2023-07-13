import { usePostToShopify } from './post-to-shopify'
import type { Cart, Attribute } from '@/utils/types'
import type { CartLineUpdateInput } from '~~/utils/storefront-api-types'

const cartQuery = `
{ 
  id
  checkoutUrl
  cost {
    totalAmount {
      amount
    }
  }
  lines(first: 200) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              handle
              title
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
  attributes {
    key
    value
  }
}`

const createQuery = `
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart ${cartQuery}
  }
}`

const addLineQuery = `
mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart ${cartQuery}
  }
}`

export async function cartLinesUpdate(
  cartId: string,
  items: CartLineUpdateInput[]
): Promise<{ cart: Cart }> {
  const { cartLinesUpdate } = await usePostToShopify(
    `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart ${cartQuery}
      }
    }`,
    { cartId, lines: items }
  )

  return cartLinesUpdate
}

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

export async function useGetCart(cartId: string): Promise<{ cart: Cart }> {
  const cart = await usePostToShopify(
    `query getCart($cartId: ID!) { cart(id: $cartId) ${cartQuery} }`,
    { cartId: cartId }
  )
  return cart
}

export async function useRemoveFromCart(cartId: string, lineIds: string[]) {
  const response = await usePostToShopify(
    ` mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart ${cartQuery}
      }
    }
  `,
    { cartId, lineIds: lineIds }
  )

  return response.cartLinesRemove.cart
}

export async function cartAttributesUpdate(
  cartId: string,
  attributes: Attribute[]
): Promise<{ cart: Cart }> {
  const { cartAttributesUpdate } = await usePostToShopify(
    `mutation cartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!) {
      cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
        cart ${cartQuery}
        userErrors {
          code
          field
          message
        }
      }
    }
    `,
    { cartId, attributes }
  )
  return cartAttributesUpdate
}
