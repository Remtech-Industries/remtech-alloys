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
    edges { 
      node { 
        id
        price { amount } 
      } 
    }
  }
}
`

type Tokens = {
  cutToken: {
    id: string
    price: number
  }
  handlingToken: {
    id: string
    price: number
  }
}

export async function getTokens(): Promise<Tokens> {
  const data = await usePostToShopify(query)
  return {
    cutToken: {
      id: data.cutToken.variants.edges[0].node.id,
      price: data.cutToken.variants.edges[0].node.price.amount,
    },
    handlingToken: {
      id: data.handlingToken.variants.edges[0].node.id,
      price: data.handlingToken.variants.edges[0].node.price.amount,
    },
  }
}
