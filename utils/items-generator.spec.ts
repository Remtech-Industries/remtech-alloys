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
      describe('Pieces', () => {
        const when = (v: any) => {
          return itemsGenerator({
            ...input,
            requestedLength: v.requestedLength,
            numberOfPieces: v.numberOfPieces,
            absoluteLength: v.absoluteLength,
          })
            .find(({ anchor }) => anchor === 'product')
            ?.attributes.find(({ key }) => key === 'Pieces')?.value
        }

        it('should return Pieces attribute @ 1 piece like this', () => {
          expect(
            when({ requestedLength: 1, numberOfPieces: 1, absoluteLength: 1 })
          ).toEqual('1 pc @ 0.039 inches (1mm)')
        })

        it('should return Pieces attribute @ more than 1 like this', () => {
          expect(
            when({ requestedLength: 3, numberOfPieces: 3, absoluteLength: 8 })
          ).toEqual('3 pcs @ 0.118 inches/ea. (8mm)')
        })
      })

      // $345.00 + $66.00C/H = $440

      describe('tagNumber', () => {
        const when = (value: any) => {
          return itemsGenerator({ ...input, tagNumber: value })
            .find(({ anchor }) => anchor === 'product')
            ?.attributes.find(({ key }) => key === 'Tag#')
        }

        it('should return Tag Number attribute when entered', () => {
          expect(when('e')).toEqual({ key: 'Tag#', value: 'e' })
        })

        it('attribute to be undefined when there is no tag number', () => {
          expect(when('')).toBeUndefined()
          expect(when(undefined)).toBeUndefined()
          expect(when(null)).toBeUndefined()
        })
      })

      const attributes = product?.attributes
      it('should return _handlingTokens attribute', () => {
        const attribute = attributes?.find(
          ({ key }) => key === '_handlingTokens'
        )
        expect(attribute).toEqual({ key: '_handlingTokens', value: '1' })
      })

      it('should return _cutTokens attribute', () => {
        const attribute = attributes?.find(({ key }) => key === '_cutTokens')
        expect(attribute).toEqual({ key: '_cutTokens', value: '1' })
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
