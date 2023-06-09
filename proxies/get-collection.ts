import { usePostToShopify } from './post-to-shopify'

const query = `
query collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 200, sortKey: PRICE) {
      edges {
        node {
          id
          title
          handle
          totalInventory
          priceRange {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
}`

export async function useGetCollection(handle: string) {
  const response = await usePostToShopify(query, { handle: handle })
  return response
}
