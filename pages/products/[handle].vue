<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="flex flex-col gap-2 p-5" v-if="product">
      <h1 class="border-b pb-2 font-oswald text-2xl font-bold text-slate-700">
        {{ product.title }}
      </h1>

      <div class="text-slate-700" if="price > 0">
        Price: {{ toMoney(price) }} / inch
      </div>

      <div class="bg-red-500">{{ cutToken }} <br /></div>

      <div class="flex gap-1 pt-2">
        <VariantSelector
          v-for="variant in variants"
          :key="variant.id"
          :variant="variant"
          :activeId="selectedVariant?.selectedVariantId"
          :stockingUnit="product.stockingUnit?.value"
        />
      </div>

      <LengthInput
        class="self-start"
        @update:length="form.length = $event"
        @update:is-valid="form.lengthIsValid = $event"
      />

      <NumberOfPiecesInput
        class="self-start"
        @update:quantity="form.numberOfPieces = $event"
        @update:is-valid="form.quantityIsValid = $event"
      />

      <AddToCartButton :items="items" />

      <div v-if="items.length">
        <h3 class="font-medium text-slate-700">Price Breakdown:</h3>

        <PricingTable :items="items" />

        <p class="mt-3 text-xs font-thin">* Our tolerance is -0.000 / +0.250</p>
        <p class="text-xs font-thin" v-if="cutWaste > 0">
          &dagger; {{ toInches(cutWaste, 'mm', 'roundIt') }}" is added to each
          piece as an additional waste charge
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toInches } from '@/utils/to-inches'
import VariantSelector from '@/components/VariantSelector.vue'
import LengthInput from '@/components/LengthInput.vue'
import NumberOfPiecesInput from '@/components/NumberOfPiecesInput.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import PricingTable from '@/components/PricingTable.vue'
import { computed, ref } from 'vue'
import { getTokens } from '~~/proxies/get-tokens'
import { useGetProduct } from '@/proxies/get-product'
import { useRoute } from 'vue-router'
import type { Form, CustomProductFields } from '@/utils/types'
import type { Product } from '@/utils/storefront-api-types'
import { itemsGenerator } from '@/utils/items-generator'
import { toMoney } from '@/utils/to-money'
import { toPricePerInch } from '@/utils/to-price-per-inch'

const { params } = useRoute()

const form = ref<Form>({
  numberOfPieces: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const { product }: { product: Product & CustomProductFields } =
  await useGetProduct(params.handle)
const { cutToken, handlingToken } = await getTokens()

const variants = computed(() => {
  if (!product) return []

  return product.variants.edges
    .map(({ node }) => node)
    .sort((a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0))
})

const selectedVariant = computed(() => {
  if (!product) return null

  const { length: requestedLength, numberOfPieces } = form.value
  const actualLengthPerPiece = requestedLength + cutWaste.value
  const absoluteLength = Math.ceil(actualLengthPerPiece * numberOfPieces)

  const foundVariant = variants.value.find(
    (variant) => (variant.quantityAvailable || 0) >= absoluteLength
  )
  if (!foundVariant) return null

  return {
    absoluteLength,
    actualLengthPerPiece,
    cutTokenId: cutToken.id,
    cutTokensPerCut: +(product.cutTokensPerCut?.value || 0),
    handlingTokenId: handlingToken.id,
    numberOfHandlingTokens: +(product.handlingTokens?.value || 0),
    numberOfPieces,
    pricePerCutToken: cutToken.price,
    pricePerHandlingToken: +handlingToken.price,
    pricePerStockingUnit: +(foundVariant.price.amount || 0),
    productTitle: product.title,
    requestedLength,
    selectedVariantId: foundVariant.id,
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

const cutWaste = computed(() => +(product?.cutWaste?.value || '0'))
</script>
