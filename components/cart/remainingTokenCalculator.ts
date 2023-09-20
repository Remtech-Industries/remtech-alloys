import { tokenHandles } from '@/utils/constants'
import type { BaseCartLine } from '@/utils/storefront-api-types'

export const remainingTokenCalculator = (line: BaseCartLine, cartItems: BaseCartLine[]) => {
  // helpers
  const productItems = () => {
    return cartItems.filter(({ merchandise }) => {
      const handle = merchandise.product.handle
      return !tokenHandles.includes(handle)
    })
  }

  const isLastItem = () => productItems.length <= 1

  const attributeValue = (key: string) => {
    return line.attributes.find((attribute) => attribute.key === key)?.value
  }

  const token = (tokenName: string) => {
    const item = cartItems.find(
      ({ merchandise }) => merchandise.product.handle === tokenName,
    )
    return { quantity: item?.quantity || 0, id: item?.id || '' }
  }


  // 
  const remainingCutTokens = () => {
    const cutTokensOnItem = +(attributeValue('_cutTokens') || 0)

    let quantity
    if (isLastItem()) {
      quantity = 0
    } else {
      quantity = token('cut-token').quantity - cutTokensOnItem
    }

    return { id: token('cut-token').id, quantity }
  }

  const remainingHandlingTokens = () => {
    const handlingTokensOnItem = +(attributeValue('_handlingTokens') || 0)

    let quantity
    if (isLastItem()) {
      quantity = 0
    } else {
      quantity = token('handling-token').quantity - handlingTokensOnItem
    }

    return { id: token('handling-token').id, quantity }
  }

  return { remainingCutTokens, remainingHandlingTokens }
}