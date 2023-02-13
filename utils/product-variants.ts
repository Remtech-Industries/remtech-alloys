import { usePostToShopify } from './post-to-shopify'

const query = `
query ($ids : [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      title
      price {
        amount
      }
    }
  }
}
`

export async function useGetProductVariants(ids: string[]) {
  const { nodes } = await usePostToShopify(query, { ids: ids })
  return nodes
}
