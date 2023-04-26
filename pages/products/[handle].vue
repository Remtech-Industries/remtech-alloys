<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="flex flex-col gap-2 p-2" v-if="product">
      <h1 class="border-b text-2xl font-bold text-slate-700">
        {{ product.title }}
      </h1>

      <h2 class="font-semibold text-slate-700">Heat Numbers</h2>

      <div class="flex gap-1">
        <VariantSelector
          v-for="variant in variants"
          :key="variant.id"
          :variant="variant"
          :activeId="selectedVariant?.id"
          :stockingUnit="product.stockingUnit?.value"
        />
      </div>

      <LengthInput
        @update:length="form.length = $event"
        @update:is-valid="form.lengthIsValid = $event"
      />

      <QuantityInput
        @update:quantity="form.quantity = $event"
        @update:is-valid="form.quantityIsValid = $event"
      />

      <AddToCartButton
        :items="items"
        :collection="product.collections?.edges[0]?.node?.title"
      />

      <div v-if="items.length">
        <h3 class="font-medium text-slate-700">Price Breakdown:</h3>

        <PricingTable :items="items" />
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
import { computed, ref, onMounted } from 'vue'
import { useGetProduct } from '@/proxies/get-product'
import { useRoute } from 'vue-router'
import type { Addons, Form, MetafieldVariant, Product } from '@/utils/types'
import type { Ref } from 'vue'
import { useGetProductVariants } from '@/proxies/get-product-variants'
import { itemsGenerator } from '@/utils/items-generator'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const product = ref<Product | null>(null)
const addons = ref<Addons | null>(null)

onMounted(async () => {
  {
    // get product
    const data = await useGetProduct(params.handle)
    product.value = data
  }
  {
    // get essential add-ons
    if (!product.value?.cutFee || !product.value?.handlingFee) return
    const data = await useGetProductVariants([
      product.value.cutFee.value,
      product.value.handlingFee.value,
    ])
    if (data.includes(null)) {
      // send notification or alert that add-on does not exist
      return
    }
    addons.value = data.reduce((acc: Addons, item: MetafieldVariant) => {
      return { ...acc, [item.addonType.value]: item }
    }, {})
  }
})

const variants = computed(() => {
  if (!product.value) return []

  return product.value.variants.edges
    .map(({ node }) => node)
    .sort((a, b) => a.quantityAvailable - b.quantityAvailable)
})

const selectedVariant = computed(() => {
  if (!product.value) return null

  const totalAmount = form.value.length * form.value.quantity
  const foundVariant = variants.value.find(
    (variant) => variant.quantityAvailable >= totalAmount
  )
  if (!foundVariant) return null

  return { ...foundVariant, productTitle: product.value.title }
})

const items = computed(() => {
  if (!selectedVariant.value) return []
  if (!addons.value) return []

  return itemsGenerator(form.value, selectedVariant.value, addons.value)
})
</script>
