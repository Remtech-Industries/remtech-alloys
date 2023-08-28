
export const productQuery = `
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
export const tokenQuery = `
query {
  cutToken: product(handle: "cut-token") {
    ...variant
  }
  handlingToken: product(handle: "handling-token") {
    ...variant
  }
}

fragment variant on Product {
  variants(first: 1) {
    edges { 
      node { 
        id
        price { amount } 
      } 
    }
  }
}
`