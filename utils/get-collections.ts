import { usePostToShopify } from './post-to-shopify'

const query = `
  query {
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
          products(first: 100) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`
export async function useGetCollections() {
  const { collections } = await usePostToShopify(query)
  return { collections: collections?.edges }
}
