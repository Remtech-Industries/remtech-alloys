import { describe, it, expect } from 'vitest'
import { itemsGenerator } from './items-generator'

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

const items = (v = {}) => itemsGenerator({ ...input, ...v })

describe('itemsGenerator', () => {
  describe('product variant', () => {
    const product = (v = {}) => {
      return items(v).find(({ anchor }) => anchor === 'product')
    }

    it('should return id equal to selectedVariantId', () => {
      expect(product()?.id).toEqual('d')
    })

    it('should return title equal to productTitle', () => {
      expect(product()?.title).toEqual('c')
    })

    describe('cartQuantity', () => {
      it('passes thru the absoluteLength', () => {
        const params = { absoluteLength: 1 }
        expect(product(params)?.cartQuantity).toEqual(1)
      })
    })

    it('should return requestedLength equal to requestedLength', () => {
      expect(product()?.requestedLength).toEqual(1)
    })

    it('should return pricePerPiece calculated from absoluteLength', () => {
      // the pricePerPiece is calculated by dividing the absoluteLength
      // by the numberOfPieces, not using requestedLength as there is a cutWaste
      expect(product()?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice calculated from absoluteLength', () => {
      expect(product()?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to numberOfPieces', () => {
      expect(product()?.displayedQuantity).toEqual(1)
    })

    describe('attributes', () => {
      const attributes = (v = {}) => product(v)?.attributes

      describe('Pieces', () => {
        const when = (v: any) => {
          return attributes(v)?.find(({ key }) => key === 'Pieces')?.value
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

      // Line: Cut Cost $3.00 Handling Cost $1.00
      describe('tagNumber', () => {
        const when = (v: any) => {
          return attributes(v)?.find(({ key }) => key === 'Tag#')?.value
        }

        it('should return Tag Number attribute when entered', () => {
          expect(when({ tagNumber: 'e' })).toEqual('e')
        })

        it('attribute to be undefined when there is no tag number', () => {
          expect(when({ tagNumber: '' })).toBeUndefined()
          expect(when({})).toBeUndefined()
          expect(when({ tagNumber: null })).toBeUndefined()
        })
      })

      it('should return _handlingTokens attribute', () => {
        const attribute = attributes()?.find(
          ({ key }) => key === '_handlingTokens'
        )
        expect(attribute).toEqual({ key: '_handlingTokens', value: '1' })
      })

      it('should return _cutTokens attribute', () => {
        const attribute = attributes()?.find(({ key }) => key === '_cutTokens')
        expect(attribute).toEqual({ key: '_cutTokens', value: '1' })
      })
    })
  })

  describe('handling fee', () => {
    const handlingFee = (v = {}) => {
      return items(v).find(({ anchor }) => anchor === 'handling-token')
    }

    it('should return id equal to handlingTokenId', () => {
      expect(handlingFee()?.id).toEqual('b')
    })

    it('should return title equal to "Handling Cost"', () => {
      expect(handlingFee()?.title).toEqual('Handling Cost')
    })

    describe('cartQuantity', () => {
      it('passes thru numberOfHandlingTokens when there is an absoluteLength', () => {
        // there is only one handling charge per line item, with many tokens
        const params = { numberOfHandlingTokens: 3, absoluteLength: 1 }
        expect(handlingFee(params)?.cartQuantity).toEqual(3)
      })

      it('is undefined when there is not an absoluteLength', () => {
        const params = { numberOfHandlingTokens: 3, absoluteLength: null }
        expect(handlingFee(params)?.cartQuantity).toBeUndefined()
      })
    })

    it('should return pricePerPiece equal to handling price', () => {
      expect(handlingFee()?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice equal to handling price', () => {
      expect(handlingFee()?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to 1', () => {
      expect(handlingFee()?.displayedQuantity).toEqual(1)
    })

    it('should return attributes equal to []', () => {
      expect(handlingFee()?.attributes).toEqual([])
    })
  })

  describe('cut fee', () => {
    const cutFee = (v = {}) => {
      return items(v).find(({ anchor }) => anchor === 'cut-token')
    }

    it('should return id equal to cutTokenId', () => {
      expect(cutFee()?.id).toEqual('a')
    })

    it('should return title equal to "Cut Cost"', () => {
      expect(cutFee()?.title).toEqual('Cut Cost')
    })

    describe('cartQuantity', () => {
      it('returns cartQuantity equal to cutTokensPerCut * numberOfPieces', () => {
        const params = { cutTokensPerCut: 1, numberOfPieces: 1 }
        expect(cutFee(params)?.cartQuantity).toEqual(1)
      })

      it('returns cartQuantity equal to cutTokensPerCut * numberOfPieces', () => {
        const params = { cutTokensPerCut: 3, numberOfPieces: 4 }
        expect(cutFee(params)?.cartQuantity).toEqual(12)
      })
    })

    it('should return pricePerPiece equal to pricePerCutToken * tokens per cut', () => {
      expect(cutFee()?.pricePerPiece).toEqual(1)
    })

    it('should return linePrice equal to price per piece * number of pieces', () => {
      expect(cutFee()?.linePrice).toEqual(1)
    })

    it('should return displayedQuantity equal to numberOfPieces', () => {
      expect(cutFee()?.displayedQuantity).toEqual(1)
    })

    it('should return attributes equal to []', () => {
      expect(cutFee()?.attributes).toEqual([])
    })
  })
})
