import { usePostToShopify } from './post-to-shopify'

const query = `
query {
  product(handle: "cut-token") {
    variants(first: 1) {
      edges {
        node {
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`

export async function useGetCutToken() {
  const { product } = await usePostToShopify(query)
  return { cutToken: product.variants.edges[0].node }
}
