import { describe, it, expect } from 'vitest'
import { itemsGenerator } from './items-generator'

describe('itemsGenerator', () => {
  const input = {
    absoluteLength: 1,
    cutTokenId: 'a',
    cutTokensPerCut: 1,
    handlingTokenId: 'b',
    numberOfHandlingTokens: 1,
    numberOfPieces: 1,
    pricePerCutToken: 1,
    pricePerHandlingToken: 1,
    pricePerStockingUnit: 1,
    productTitle: 'c',
    requestedLength: 1,
    selectedVariantId: 'd',
  }

  describe('product variant', () => {
    const product = itemsGenerator(input).find(
      ({ anchor }) => anchor === 'product'
    )

    it('should return id equal to selectedVariantId', () => {
      expect(product?.id).toEqual('d')
    })

    it('should return title equal to productTitle', () => {
      expect(product?.title).toEqual('c')
    })

    it('should return cartQuantity equal to absoluteLength', () => {
      expect(product?.cartQuantity).toEqual(1)
    })

    it('should return requestedLength equal to requestedLength', () => {
      expect(product?.requestedLength).toEqual(1)
    })

    it('should return pricePerPiece calculated from absoluteLength', () => {
      // the pricePerPiece is calculated by dividing the absoluteLength
      // by the numberOfPieces, not using requestedLength as there is a cutWaste
      expect(product?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice calculated from absoluteLength', () => {
      expect(product?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to numberOfPieces', () => {
      expect(product?.displayedQuantity).toEqual(1)
    })

    describe('attributes', () => {
      it('should return Pieces attribute', () => {
        expect(product?.attributes[0]).toEqual({
          key: 'Pieces',
          value: '1 pcs @ 0.039 inches/ea. (1mm)',
        })
      })

      it('should return _handlingTokens attribute', () => {
        expect(product?.attributes[1]).toEqual({
          key: '_handlingTokens',
          value: '1',
        })
      })

      it('should return _cutTokens attribute', () => {
        expect(product?.attributes[2]).toEqual({
          key: '_cutTokens',
          value: '1',
        })
      })
    })
  })

  describe('handling fee', () => {
    const handlingFee = itemsGenerator(input).find(
      ({ anchor }) => anchor === 'handling-token'
    )

    it('should return id equal to handlingTokenId', () => {
      expect(handlingFee?.id).toEqual('b')
    })

    it('should return title equal to "Handling Cost"', () => {
      expect(handlingFee?.title).toEqual('Handling Cost')
    })

    it('should return cartQuantity equal to numberOfHandlingTokens', () => {
      expect(handlingFee?.cartQuantity).toEqual(1)
    })

    it('should return pricePerPiece equal to handling price', () => {
      expect(handlingFee?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice equal to handling price', () => {
      expect(handlingFee?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to 1', () => {
      expect(handlingFee?.displayedQuantity).toEqual(1)
    })

    it('should return attributes equal to []', () => {
      expect(handlingFee?.attributes).toEqual([])
    })
  })

  describe('cut fee', () => {
    const cutFee = itemsGenerator(input).find(
      ({ anchor }) => anchor === 'cut-token'
    )

    it('should return id equal to cutTokenId', () => {
      expect(cutFee?.id).toEqual('a')
    })

    it('should return title equal to "Cut Cost"', () => {
      expect(cutFee?.title).toEqual('Cut Cost')
    })

    it('should return cartQuantity equal to totalCutTokens', () => {
      // cut tokens per number of pieces
      expect(cutFee?.cartQuantity).toEqual(1)
    })

    it('should return pricePerPiece equal to pricePerCutToken * tokens per cut', () => {
      expect(cutFee?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice equal to price per piece * number of pieces', () => {
      expect(cutFee?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to numberOfPieces', () => {
      expect(cutFee?.displayedQuantity).toEqual(1)
    })

    it('should return attributes equal to []', () => {
      expect(cutFee?.attributes).toEqual([])
    })
  })
})
