export const collectionsQuery = `
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

export const collectionQuery = `
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