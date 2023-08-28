<template>
  <div class="flex">
    <CollectionSidebar class="hidden md:block" />

    <div v-if="product" class="w-full p-5">
      <div v-if="isOutOfStock" class="flex flex-col gap-2">
        <h1 class="border-b pb-2 font-oswald text-2xl font-bold text-slate-700">
          {{ product.title }}
        </h1>

        <div class="text-slate-700" if="price > 0">
          Price: {{ toMoney(price) }} / inch
        </div>

        <div class="rounded border bg-yellow-500 p-3">Out of stock</div>
      </div>

      <div class="flex w-full flex-col gap-2" v-else>
        <h1 class="border-b pb-2 font-oswald text-2xl font-bold text-slate-700">
          {{ product.title }}
        </h1>

        <div class="text-slate-700" if="price > 0">
          Price: {{ toMoney(price) }} / inch
        </div>

        <div class="flex gap-1 overflow-x-auto pt-2">
          <VariantSelector
            v-for="variant in variants"
            :key="variant.id"
            :variant="variant"
            :activeId="selectedVariant?.selectedVariantId"
            :stockingUnit="product.stockingUnit?.value"
          />
        </div>
        <hr />

        <div v-if="!selectedVariant" class="rounded border bg-yellow-500 p-3">
          You have selected more material than we have on our longest bar.
        </div>

        <RequestedLengthInput
          class="self-start"
          @update:length="form.requestedLength = $event"
          @update:is-valid="form.lengthIsValid = $event"
        />

        <NumberOfPiecesInput
          class="self-start"
          @update:quantity="form.numberOfPieces = $event"
          @update:is-valid="form.quantityIsValid = $event"
        />

        <div class="flex">
          <div class="rounded-l bg-slate-600 px-2 py-1 text-slate-50">Tag#</div>

          <input
            class="rounded-r border px-2 py-1 shadow-inner"
            v-model="form.tagNumber"
            placeholder="(optional)"
          />
        </div>

        <div class="rounded border bg-yellow-500 p-3">
          Currently, the Add to Cart is only available for local pickups. Please
          send RFQ to place an order if you require delivery.
          <nuxt-link class="font-bold" to="/pages/rfq">Click Here</nuxt-link>
        </div>

        <AddToCartButton :items="items" />

        <div v-if="items.length" class="w-full rounded-xl bg-white p-6">
          <h3 class="font-medium text-slate-700">Price Breakdown:</h3>

          <PricingTable :items="items" />

          <p class="mt-3 text-xs font-thin">
            * Our tolerance is -0.000 / +0.250
          </p>
          <p class="text-xs font-thin" v-if="cutWaste > 0">
            &dagger; Length added to each piece as an additional cutting waste
            charge
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VariantSelector from '@/components/VariantSelector.vue'
import RequestedLengthInput from '@/components/RequestedLengthInput.vue'
import NumberOfPiecesInput from '@/components/NumberOfPiecesInput.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import PricingTable from '@/components/PricingTable.vue'
import { getTokens } from '@/proxies/get-tokens'
import type { Form, ProductResponse } from '@/utils/types'
import { itemsGenerator } from '@/utils/items-generator'
import { toPricePerInch, toMoney } from '@/utils/conversion'
import {
  computed,
  ref,
  useHead,
  useRoute,
  useShopifyUrl,
  useLazyFetch,
  useShopifyOptions,
} from '#imports'
import { productQuery } from '@/utils/products'

const { params } = useRoute()

const form = ref<Form>({
  numberOfPieces: 0,
  quantityIsValid: false,
  requestedLength: 0,
  lengthIsValid: false,
})

const { data } = await useLazyFetch<ProductResponse>(useShopifyUrl(), {
  ...useShopifyOptions(productQuery, { handle: params.handle, first: 250 }),
  key: 'product',
})

const product = computed(() => {
  return data.value?.data?.product
})

const { cutToken, handlingToken } = await getTokens()

const variants = computed(() => {
  if (!product.value) return []

  return product.value?.variants.edges
    .map(({ node }) => node)
    .sort((a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0))
})

const isOutOfStock = computed(() => {
  if (!product.value) return false
  return product.value?.totalInventory === 0
})

const selectedVariant = computed(() => {
  if (!product) return null

  const { requestedLength, numberOfPieces, tagNumber } = form.value
  const actualLengthPerPiece = requestedLength + cutWaste.value
  const absoluteLength = Math.ceil(actualLengthPerPiece * numberOfPieces)

  const foundVariant = variants.value.find(
    (variant) => (variant.quantityAvailable || 0) >= absoluteLength,
  )

  if (!foundVariant) return null

  return {
    absoluteLength,
    actualLengthPerPiece,
    cutTokenId: cutToken.id,
    cutTokensPerCut: +(product.value?.cutTokensPerCut?.value || 0),
    handlingTokenId: handlingToken.id,
    numberOfHandlingTokens: +(product.value?.handlingTokens?.value || 0),
    numberOfPieces,
    pricePerCutToken: cutToken.price,
    pricePerHandlingToken: +handlingToken.price,
    pricePerStockingUnit: +(foundVariant.price.amount || 0),
    productTitle: product.value?.title || '',
    requestedLength,
    selectedVariantId: foundVariant.id,
    tagNumber,
  }
})

const price = computed(() => {
  const p = selectedVariant.value?.pricePerStockingUnit
  if (p) return toPricePerInch(p, 'mm')
  return 0
})

const items = computed(() => {
  if (!selectedVariant.value) return []
  return itemsGenerator(selectedVariant.value)
})

const cutWaste = computed(() => +(product.value?.cutWaste?.value || '0'))

useHead({
  title: product.value?.title,
})
</script>
