import { useCartStore } from '@/stores/cart'

import type { ProductVariant } from './storefront-api-types'

export function availableQuantity(
  barId: ProductVariant['id'],
  storeQuantity: number,
) {
  const { cart } = useCartStore()
  if (!cart) return storeQuantity

  let cartQuantity = 0
  for (let i = 0; i < cart.lines.edges.length; i++) {
    const line = cart.lines.edges[i]
    if (line.node.merchandise.id === barId) cartQuantity += line.node.quantity
  }
  return storeQuantity - cartQuantity
}
