import { useCartStore } from '@/stores/cart'

import type { Product, ProductVariant } from './storefront-api-types'

export function availableVariantQuantity(
  productVariantId: ProductVariant['id'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  const cartQuantity = cart.lines.edges.reduce((sum, { node }) => {
    if (node.merchandise.id !== productVariantId) return sum
    return sum + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}

export function availableProductQuantity(
  productHandle: Product['handle'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  const cartQuantity = cart.lines.edges.reduce((sum, { node }) => {
    if (node.merchandise.product.handle !== productHandle) return sum
    return sum + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}
