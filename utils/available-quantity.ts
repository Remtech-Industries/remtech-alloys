import type { Cart, Product, ProductVariant } from './storefront-api-types'

export function availableVariantQuantity(
  productVariantId: ProductVariant['id'],
  shopifyQuantity: number,
  cartLinesEdges: Cart['lines']['edges'],
) {
  const cartQuantity = cartLinesEdges.reduce((sum, { node }) => {
    if (node.merchandise.id !== productVariantId) return sum
    return sum + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}

export function availableProductQuantity(
  productHandle: Product['handle'],
  shopifyQuantity: number,
  cartLinesEdges: Cart['lines']['edges'],
) {
  const cartQuantity = cartLinesEdges.reduce((sum, { node }) => {
    if (node.merchandise.product.handle !== productHandle) return sum
    return sum + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}
