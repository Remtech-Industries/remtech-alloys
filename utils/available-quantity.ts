import { useCartStore } from '@/stores/cart'

import type { Product, ProductVariant } from './storefront-api-types'

export function availableQuantity(
  barId: ProductVariant['id'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  let cartQuantity = 0
  for (let i = 0; i < cart.lines.edges.length; i++) {
    const line = cart.lines.edges[i]
    if (line.node.merchandise.id === barId) cartQuantity += line.node.quantity
  }
  return shopifyQuantity - cartQuantity
}

export function availableProductQuantity(
  productHandle: Product['handle'],
  shopifyQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return shopifyQuantity

  let cartQuantity = 0
  for (let i = 0; i < cart.lines.edges.length; i++) {
    const line = cart.lines.edges[i]
    if (line.node.merchandise.product.handle === productHandle)
      cartQuantity += line.node.quantity
  }
  return shopifyQuantity - cartQuantity
}
