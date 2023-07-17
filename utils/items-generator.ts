import { toInches } from '@/utils/conversion'
import type {
  AttributeInput,
  ProductVariant,
  Product,
  CartLineInput,
  CartLine,
} from '@/utils/storefront-api-types'

interface Input {
  absoluteLength: number
  cutTokenId: ProductVariant['id']
  cutTokensPerCut: number
  handlingTokenId: ProductVariant['id']
  numberOfHandlingTokens: number
  numberOfPieces: number
  pricePerCutToken: number
  pricePerHandlingToken: number
  pricePerStockingUnit: number
  productTitle: Product['title']
  requestedLength: number
  selectedVariantId: ProductVariant['id']
  tagNumber?: string | null
}

export type Item = {
  /** Anchor is for searching. */
  anchor: 'product' | 'cut-token' | 'handling-token'
  attributes: AttributeInput[]
  cartQuantity: CartLineInput['quantity']
  displayedQuantity: number
  id: ProductVariant['id']
  linePrice: number
  pricePerPiece: number
  requestedLength?: number
  title: Product['title']
}

export function itemsGenerator(input: Input) {
  const {
    absoluteLength,
    cutTokenId,
    cutTokensPerCut,
    handlingTokenId,
    numberOfHandlingTokens,
    numberOfPieces,
    pricePerCutToken,
    pricePerHandlingToken,
    pricePerStockingUnit,
    productTitle,
    requestedLength,
    selectedVariantId,
    tagNumber,
  } = input

  const totalCutTokens = numberOfPieces * cutTokensPerCut

  // product variant
  const productVariantRow: Item = {
    anchor: 'product',
    id: selectedVariantId,
    title: productTitle,
    cartQuantity: absoluteLength,
    requestedLength: requestedLength,
    pricePerPiece: (absoluteLength / numberOfPieces) * pricePerStockingUnit,
    linePrice: absoluteLength * pricePerStockingUnit,
    displayedQuantity: numberOfPieces,
    attributes: [
      {
        key: 'Pieces',
        value: `${numberOfPieces} pcs @ ${toInches(
          requestedLength,
          'mm',
          'roundIt'
        )} inches/ea. (${absoluteLength}mm)`,
      },
      {
        key: '_handlingTokens',
        value: `${numberOfHandlingTokens}`,
      },
      {
        key: '_cutTokens',
        value: `${totalCutTokens}`,
      },
    ],
  }

  if (tagNumber) {
    productVariantRow.attributes.push({
      key: 'Tag#',
      value: tagNumber,
    })
  }

  // handling fee
  const handlingPrice = pricePerHandlingToken * numberOfHandlingTokens
  const handlingFeeRow: Item = {
    anchor: 'handling-token',
    id: handlingTokenId,
    title: 'Handling Cost',
    cartQuantity: absoluteLength ? numberOfHandlingTokens : 0,
    pricePerPiece: handlingPrice,
    linePrice: handlingPrice,
    displayedQuantity: 1,
    attributes: [],
  }

  // cut fee
  const cutPricePerPiece = pricePerCutToken * cutTokensPerCut
  const cutFeeRow: Item = {
    anchor: 'cut-token',
    id: cutTokenId,
    title: 'Cut Cost',
    cartQuantity: totalCutTokens,
    pricePerPiece: cutPricePerPiece,
    linePrice: numberOfPieces * cutPricePerPiece,
    displayedQuantity: numberOfPieces,
    attributes: [],
  }

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    (item) => item?.cartQuantity != null && item.cartQuantity > 0
  )
}
