import { toMoney, toInches } from './conversion'
import type {
  AttributeInput,
  ProductVariant,
  Product,
  CartLineInput,
} from '@/utils/storefront-api-types'

type MM = number
interface Input {
  absoluteLength: MM
  cutTokenId: ProductVariant['id']
  cutTokensPerCut: number
  handlingTokenId: ProductVariant['id']
  numberOfHandlingTokens: number
  numberOfPieces: number
  pricePerCutToken: number
  pricePerHandlingToken: number
  pricePerStockingUnit: number
  productTitle: Product['title']
  /** This is the value in MM requested by the customer in the product form. */
  requestedLength: MM
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

  const productLinePrice = absoluteLength * pricePerStockingUnit
  const handlingLinePrice = pricePerHandlingToken * numberOfHandlingTokens
  const cutPricePerPiece = pricePerCutToken * cutTokensPerCut
  const cutLinePrice = numberOfPieces * cutPricePerPiece

  // product variant
  const productVariantRow: Item = {
    anchor: 'product',
    id: selectedVariantId,
    title: productTitle,
    cartQuantity: absoluteLength,
    requestedLength: requestedLength,
    pricePerPiece: (absoluteLength / numberOfPieces) * pricePerStockingUnit,
    linePrice: productLinePrice,
    displayedQuantity: numberOfPieces,
    attributes: [
      { key: '_handlingTokens', value: `${numberOfHandlingTokens}` },
      { key: '_cutTokens', value: `${totalCutTokens}` },
      { key: '_time', value: `${Date.now()}` }
    ],
  }

  const pcs = (n: number) => (n === 1 ? 'pc' : 'pcs')
  const ea = (n: number) => (n === 1 ? '' : '/ea.')
  productVariantRow.attributes.push({
    key: 'Pieces',
    value: `${numberOfPieces} ${pcs(numberOfPieces)} @ ${toInches(
      requestedLength,
      'mm',
      'roundIt'
    )} inches${ea(numberOfPieces)}`,
  })

  if (tagNumber) {
    productVariantRow.attributes.push({ key: 'Tag#', value: tagNumber })
  }

  const tempPrice = `${toMoney(
    (productLinePrice + handlingLinePrice + cutLinePrice) / numberOfPieces
  )}`
  productVariantRow.attributes.push({
    key: '_costPerPiece',
    value: tempPrice,
  })

  // handling fee
  const handlingFeeRow: Item = {
    anchor: 'handling-token',
    id: handlingTokenId,
    title: 'Handling Cost',
    cartQuantity: absoluteLength ? numberOfHandlingTokens : 0,
    pricePerPiece: handlingLinePrice,
    linePrice: handlingLinePrice,
    displayedQuantity: 1,
    attributes: [],
  }

  // cut fee
  const cutFeeRow: Item = {
    anchor: 'cut-token',
    id: cutTokenId,
    title: 'Cut Cost',
    cartQuantity: totalCutTokens,
    pricePerPiece: cutPricePerPiece,
    linePrice: cutLinePrice,
    displayedQuantity: numberOfPieces,
    attributes: [],
  }

  return [productVariantRow, handlingFeeRow, cutFeeRow].filter(
    (item) => item?.cartQuantity != null && item.cartQuantity > 0
  )
}
