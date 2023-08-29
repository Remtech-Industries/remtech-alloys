import { usePostToShopify } from './post-to-shopify'
import type { AttributeInput, Cart } from '@/utils/storefront-api-types'

const cartQuery = `
{ 
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
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

export async function useGetCart(
  cartId: string,
): Promise<{ cart: Cart | null }> {
  const cart = await usePostToShopify(
    `query getCart($cartId: ID!) { cart(id: $cartId) ${cartQuery} }`,
    { cartId: cartId },
  )
  return cart
}

export async function cartAttributesUpdate(
  cartId: string,
  attributes: AttributeInput[],
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
    { cartId, attributes },
  )
  return cartAttributesUpdate
}
