import { usePostToShopify } from './post-to-shopify'

const query = `
query collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
}`

export async function useGetCollection(handle: string) {
  const shopifyResponse = await usePostToShopify(query, { handle: handle })
  return shopifyResponse
}
