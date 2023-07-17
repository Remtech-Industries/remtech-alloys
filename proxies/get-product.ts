import { usePostToShopify } from './post-to-shopify'
import type { Product, ProductVariantsArgs } from '@/utils/storefront-api-types'

const query = `
query product($handle: String!, $first: Int!) {
  product(handle: $handle) {
    id
    handle
    description
    title
    totalInventory
    variants(first: $first) {
      edges {
        node {
          id
          title
          quantityAvailable
          price {
            amount
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
    cutTokensPerCut: metafield(namespace: "custom", key: "cut_tokens_per_cut") {
      value
    }
    handlingTokens: metafield(namespace: "custom", key: "handling_tokens") {
      value
    }
    cutWaste: metafield(namespace: "custom", key: "cut_waste") {
      value
    }
  }
}
`

type CustomProductFields = {
  cutTokensPerCut?: { value: string }
  handlingTokens?: { value: string }
  stockingUnit?: { value: string }
  cutWaste?: { value: string }
}

type Variables = {
  handle: Product['handle']
} & ProductVariantsArgs

export async function getProduct(
  handle: string | string[]
): Promise<{ product: Product & CustomProductFields }> {
  const parsedHandle = Array.isArray(handle) ? handle[0] : handle
  const variables = { handle: parsedHandle, first: 250 } as Variables

  const { product } = await usePostToShopify(query, variables)
  return { product }
}
