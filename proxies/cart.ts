import { usePostToShopify } from './post-to-shopify'
import type { Cart, CartLineInput } from '@/utils/storefront-api-types'

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

export async function cartLinesAdd(
  items: CartLineInput[],
  cartId?: string
): Promise<{ cart: Cart }> {
  if (cartId) {
    const { cartLinesAdd } = await usePostToShopify(
      `mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart ${cartQuery}
          userErrors {
            code
            field
            message
          }
        }
      }`,
      { cartId, lines: items }
    )

    return cartLinesAdd
  } else {
    // create new cart
    const { cartCreate } = await usePostToShopify(
      `mutation createCart($cartInput: CartInput) {
        cartCreate(input: $cartInput) {
          cart ${cartQuery}
          userErrors {
            code
            field
            message
          }
        }
      }`,
      { cartInput: { lines: items } }
    )

    return cartCreate
  }
}