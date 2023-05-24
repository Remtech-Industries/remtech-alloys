<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="flex flex-col gap-2 p-5" v-if="product">
      <h1 class="border-b pb-2 font-oswald text-2xl font-bold text-slate-700">
        {{ product.title }}
      </h1>

      <div class="text-slate-700">Price: {{ toMoney(price) }} / inch</div>

      <div class="bg-red-500">
        {{ cutToken }}
      </div>

      <div class="flex gap-1 pt-2">
        <VariantSelector
          v-for="variant in variants"
          :key="variant.id"
          :variant="variant"
          :activeId="selectedVariant?.id"
          :stockingUnit="product.stockingUnit?.value"
        />
      </div>

      <LengthInput
        class="self-start"
        @update:length="form.length = $event"
        @update:is-valid="form.lengthIsValid = $event"
      />

      <QuantityInput
        class="self-start"
        @update:quantity="form.quantity = $event"
        @update:is-valid="form.quantityIsValid = $event"
      />

      <AddToCartButton :items="items" />

      <div v-if="items.length">
        <h3 class="font-medium text-slate-700">Price Breakdown:</h3>

        <PricingTable :items="items" :cut-waste="cutWaste" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VariantSelector from '@/components/VariantSelector.vue'
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import AddToCartButton from '@/components/AddToCartButton.vue'
import PricingTable from '@/components/PricingTable.vue'
import { computed, ref } from 'vue'
import { useGetCutToken } from '@/proxies/get-cut-token'
import { useGetProduct } from '@/proxies/get-product'
import { useRoute } from 'vue-router'
import type { Form, CustomProductFields } from '@/utils/types'
import type { Ref } from 'vue'
import type { Product } from '@/utils/storefront-api-types'
import { itemsGenerator } from '@/utils/items-generator'
import { toMoney } from '@/utils/to-money'
import { toPricePerInch } from '@/utils/to-price-per-inch'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const { product }: { product: Product & CustomProductFields } =
  await useGetProduct(params.handle)

const variants = computed(() => {
  if (!product) return []

  return product.variants.edges
    .map(({ node }) => node)
    .sort((a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0))
})

const selectedVariant = computed(() => {
  if (!product) return null

  const { length, quantity } = form.value
  const totalAmount = (length + +cutWaste.value) * quantity
  const foundVariant = variants.value.find(
    (variant) => (variant.quantityAvailable || 0) >= totalAmount
  )
  if (!foundVariant) return null

  return {
    ...foundVariant,
    productTitle: product.title,
    cutWaste: cutWaste.value,
    cutTokensPerCut: product.cutTokensPerCut?.value,
    pricePerCutToken: cutToken.price.amount,
  }
})

const price = computed(() => toPricePerInch(pricePerStockingUnit.value, 'mm'))

const { cutToken } = await useGetCutToken()

const items = computed(() => {
  if (!selectedVariant.value) return []
  return itemsGenerator(form.value, selectedVariant.value)
})

const cutWaste = computed(() => +(product?.cutWaste?.value || '0'))
const pricePerStockingUnit = computed(
  () => +(selectedVariant.value?.price.amount || '0')
)
</script>
