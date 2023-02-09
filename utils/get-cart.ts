import { usePostToShopify } from './post-to-shopify'

const query = `
query getCart($cartId: ID!) {
  cart(id: $cartId) {
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
  }
}
`

export async function useGetCart(cartId: string) {
  const { cart } = await usePostToShopify(query, { cartId: cartId })
  console.log(cart)
  return { cart }
}
