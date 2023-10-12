import { useCartStore } from '@/stores/cart'

import type { Product, ProductVariant } from './storefront-api-types'

export function availableVariantQuantity(
  barId: ProductVariant['id'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  const cartQuantity = cart.lines.edges.reduce((total, { node }) => {
    if (node.merchandise.id !== barId) return total
    return total + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}

export function availableProductQuantity(
  productHandle: Product['handle'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  const cartQuantity = cart.lines.edges.reduce((total, { node }) => {
    if (node.merchandise.product.handle !== productHandle) return total
    return total + node.quantity
  }, 0)
  return shopifyQuantity - cartQuantity
}
