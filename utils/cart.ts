const cartQuery = `
{ 
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 200) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              handle
              title
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
        attributes {
          key
          value
        }
      }
    }
  }
  attributes {
    key
    value
  }
}`

export const cartLinesUpdateQuery = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart ${cartQuery}
      userErrors {
        code
        field
        message
      }
    }
  }`

export const cartAttributesUpdateQuery = `
  mutation cartAttributesUpdate($attributes: [AttributeInput!]!, $cartId: ID!) {
    cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
      cart ${cartQuery}
      userErrors {
        code
        field
        message
      }
    }
  }`

export const getCartQuery = `
  query getCart($cartId: ID!) { 
    cart(id: $cartId) ${cartQuery} 
  }
`