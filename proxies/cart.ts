import { usePostToShopify } from './post-to-shopify'
import { useFetch } from '#imports'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import type {
  AttributeInput,
  Cart,
  CartLineUpdateInput,
  CartLineInput,
  CartLinesUpdatePayload,
} from '@/utils/storefront-api-types'

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

export async function cartLinesUpdate(
  cartId: string,
  items: CartLineUpdateInput[]
) {
  const { data } = await useFetch<CartLinesUpdatePayload>(useShopifyUrl(), { ...useShopifyOptions(
    `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart ${cartQuery}
        userErrors {
          code
          field
          message
        }
      }
    }`,
    { cartId, lines: items }
  ), key: 'cartLinesUpdate'})

  return { cart: data.value?.cart || null }
}

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

export async function useGetCart(
  cartId: string
): Promise<{ cart: Cart | null }> {
  const cart = await usePostToShopify(
    `query getCart($cartId: ID!) { cart(id: $cartId) ${cartQuery} }`,
    { cartId: cartId }
  )
  return cart
}

export async function cartAttributesUpdate(
  cartId: string,
  attributes: AttributeInput[]
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
