import { usePostToShopify } from './post-to-shopify'
import type { Cart, Attribute, CartLineInput } from '@/utils/types'

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

const updateCartQuery = `
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart ${cartQuery}
  }
}
`

export async function useUpdateCart(
  items: { id: string; quantity: number }[],
  cartId: string
) {
  const cart = await usePostToShopify(updateCartQuery, {
    cartId,
    lines: items,
  })

  return cart.cartLinesUpdate.cart
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
    `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
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
