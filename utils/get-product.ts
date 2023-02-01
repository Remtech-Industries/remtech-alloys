import { usePostToShopify } from './post-to-shopify'

const query = `
query getProduct($handle: String!) {
  productByHandle(handle: $handle) {
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
    images(first: 1) {
      edges {
        node {
          src
          altText
        }
      }
    }
  }
}
`

export async function useGetProduct(event: any) {
  const { itemHandle } = event
  const shopifyResponse = await usePostToShopify(query, { handle: itemHandle })
  return JSON.stringify(shopifyResponse)
}
