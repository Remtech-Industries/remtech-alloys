import { it, describe, expect } from 'vitest'
import { remainingTokenCalculator } from './remainingTokenCalculator'

const productCartItem = {
  id: "1", // cart item id
  quantity: 35,
  merchandise: { product: { handle: "316l-ss-1-00-25mm-diameter" } },
  attributes: [
    { key: "_handlingTokens", value: "1" },
    { key: "_cutTokens", value: "1" },
    // where _coring_tokens, _prep_tokens will go
  ]
}

const handlingTokenCartItem = {
  id: "2", // cart item id
  quantity: 1,
  merchandise: { product: { handle: "handling-token" } },
}

const cutTokenCartItem = {
  id: "3", // cart item id
  quantity: 1,
  merchandise: { product: { handle: "cut-token" } },
}

describe('remainingTokenCalculator', () => {
  it('calculate simplest example', () => {
    const cartItemToRemove = productCartItem
    const allCartItems = [productCartItem, handlingTokenCartItem, cutTokenCartItem]
    const result = remainingTokenCalculator(cartItemToRemove, allCartItems)

    expect(result.remainingHandlingTokens).toEqual({ id: '2', quantity: 0 })
    expect(result.remainingCutTokens).toEqual({ id: '3', quantity: 0 })
  })

  it('calculates when its not the last item', () => {
    const cartItemToRemove = { ...productCartItem, id: 'random-1' }
    const allCartItems = [
      cartItemToRemove,
      { ...productCartItem, id: 'random-2' },
      { ...handlingTokenCartItem, quantity: 2 },
      { ...cutTokenCartItem, quantity: 2 }
    ]
    const result = remainingTokenCalculator(cartItemToRemove, allCartItems)

    expect(result.remainingHandlingTokens).toEqual({ id: '2', quantity: 1 })
    expect(result.remainingCutTokens).toEqual({ id: '3', quantity: 1 })
  })

  it('calculates when there are just too many tokens', () => {
    const cartItemToRemove = { ...productCartItem, id: 'random-1' }
    const allCartItems = [
      cartItemToRemove,
      { ...productCartItem, id: 'random-2' },
      { ...handlingTokenCartItem, quantity: 4 },
      { ...cutTokenCartItem, quantity: 4 }
    ]
    const result = remainingTokenCalculator(cartItemToRemove, allCartItems)

    expect(result.remainingHandlingTokens).toEqual({ id: '2', quantity: 1 })
    expect(result.remainingCutTokens).toEqual({ id: '3', quantity: 1 })
  })

  it('calculate when there are just too few tokens', () => {
    const cartItemToRemove = { ...productCartItem, id: 'random-1' }
    const allCartItems = [
      cartItemToRemove,
      { ...productCartItem, id: 'random-2' },
      { ...handlingTokenCartItem, quantity: 0 },
      { ...cutTokenCartItem, quantity: 0 }
    ]
    const result = remainingTokenCalculator(cartItemToRemove, allCartItems)

    expect(result.remainingHandlingTokens).toEqual({ id: '2', quantity: 1 })
    expect(result.remainingCutTokens).toEqual({ id: '3', quantity: 1 })
  })
})