import { usePostToShopify } from './post-to-shopify'

const query = `
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    lines(first: 100) {
      edges {
        node {
          id
          quantity
        }
      }
    }
  }
}
`

export async function useGetCart(cartId: string) {
  const { cart } = await usePostToShopify(query, { cartId: cartId })
  return { cart }
}
