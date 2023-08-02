import type { Maybe, Shop, CollectionConnection, Collection, Page } from './storefront-api-types'

export type Form = {
  numberOfPieces: number
  quantityIsValid: boolean
  requestedLength: number
  lengthIsValid: boolean
  tagNumber?: string
}

export type ShopifyResponse<T> = {
  data?: Maybe<T>
  /** string[] is one response, there might be more
   * if more are discovered, this type will need to be updated */
  errors?: string[]
}

export type CollectionResponse = ShopifyResponse<{ collection?: Collection }>
export type CollectionsResponse = ShopifyResponse<{ collections?: CollectionConnection }>
export type PageResponse = ShopifyResponse<{ page?: Page }>
export type ShopResponse = ShopifyResponse<{ shop?: Shop }>

export type * from './storefront-api-types'
