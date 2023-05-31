import { usePostToShopify } from './post-to-shopify'

const query = `
query collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 100, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
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
