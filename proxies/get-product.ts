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
    stockingUnit: metafield(namespace: "custom", key: "stocking_unit") {
      value
    }
    cutFee: metafield(namespace: "custom", key: "cut_fee") {
      value
    }
    handlingFee: metafield(namespace: "custom", key: "handling_fee") {
      value
    }
  }
}
`

export async function useGetProduct(handle: string | string[]) {
  const { product } = await usePostToShopify(query, { handle: handle })
  return product
}
