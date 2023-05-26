import { usePostToShopify } from './post-to-shopify'

const query = `
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
    edges { node { price { amount } } }
  }
}
`

export async function getTokens() {
  const data = await usePostToShopify(query)
  return {
    cutToken: { price: data.cutToken.variants.edges[0].node.price.amount },
    handlingToken: {
      price: data.handlingToken.variants.edges[0].node.price.amount,
    },
  }
}
