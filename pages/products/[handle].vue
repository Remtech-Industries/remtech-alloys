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

        <PricingTable :items="items" :cut-waste="product.cutWaste?.value" />
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
import { useGetCutToken } from '@/proxies/get-cut-token'
import { useGetProduct } from '@/proxies/get-product'
import { useRoute } from 'vue-router'
import type {
  Addons,
  Form,
  MetafieldVariant,
  CustomProductFields,
} from '@/utils/types'
import type { Ref } from 'vue'
import type { Product } from '@/utils/storefront-api-types'
import { useGetProductVariants } from '@/proxies/get-product-variants'
import { itemsGenerator } from '@/utils/items-generator'
import { toMoney } from '@/utils/to-money'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const product = ref<(Product & CustomProductFields) | null>(null)
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
    .sort((a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0))
})

const selectedVariant = computed(() => {
  if (!product.value) return null

  const totalAmount = form.value.length * form.value.quantity
  const foundVariant = variants.value.find(
    (variant) => (variant.quantityAvailable || 0) >= totalAmount
  )
  if (!foundVariant) return null

  return {
    ...foundVariant,
    productTitle: product.value.title,
    cutWaste: product.value.cutWaste?.value,
  }
})

const items = computed(() => {
  if (!selectedVariant.value) return []
  if (!addons.value) return []

  return itemsGenerator(form.value, selectedVariant.value, addons.value)
})

const price = computed(() => {
  if (selectedVariant.value) {
    return +selectedVariant.value.priceV2.amount * 25.4
  }
  return 0 // or any other default value you prefer
})

const { cutToken } = await useGetCutToken()
</script>
