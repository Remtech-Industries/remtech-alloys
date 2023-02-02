import { usePostToShopify } from './post-to-shopify'

const query = `
query product($handle: String!) {
  product(handle: $handle) {
    id
    handle
    description
    title
    totalInventory
    variants(first: 5) {
      edges {
        node {
          id
          title
          quantityAvailable
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
}
`

export async function useGetProduct(handle: string) {
  const shopifyResponse = await usePostToShopify(query, { handle: handle })
  return shopifyResponse
}
