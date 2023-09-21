import { tokenHandles } from '@/utils/constants'
import type { BaseCartLine } from '@/utils/storefront-api-types'

export const remainingTokenCalculator = (cartItemToRemove: BaseCartLine, allCartItems: BaseCartLine[]) => {
  const productItemsNotGettingRemoved = () => {
    return allCartItems.filter((item) => {
      return !tokenHandles.includes(item.merchandise.product.handle) && item.id !== cartItemToRemove.id
    })
  }

  const sumRemainingTokens = (type: string) => {
    return productItemsNotGettingRemoved().reduce((sum, safeItem) => {
      const tokensOnItem = +(safeItem.attributes.find(({ key }) => key === type)?.value || 0)
      return sum + tokensOnItem
    }, 0)
  }

  const findToken = (handle: string) => {
    const item = allCartItems.find(
      ({ merchandise }) => merchandise.product.handle === handle,
    )
    return { quantity: item?.quantity || 0, id: item?.id || '' }
  }

  const remainingTokens = (attribute: string, tokenName: string) => {
    const token = findToken(tokenName)
    const quantity = sumRemainingTokens(attribute)

    return { id: token.id, quantity }
  }

  return {
    remainingCutTokens: remainingTokens('_cutTokens', 'cut-token'),
    remainingHandlingTokens: remainingTokens('_handlingTokens', 'handling-token'),
  }
}