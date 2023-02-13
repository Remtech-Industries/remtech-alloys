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
          :activeId="selectedVariant.id"
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
        v-if="selectedVariant"
        :form="form"
        :selectedVariant="selectedVariant"
      />

      <PricingTable
        :form="form"
        :product="product"
        :variant="selectedVariant"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VariantSelector from '~~/components/VariantSelector.vue'
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import AddToCartButton from '~~/components/AddToCartButton.vue'
import PricingTable from '@/components/PricingTable.vue'
import { computed, ref, onMounted } from 'vue'
import { useGetProduct } from '@/utils/get-product'
import { useRoute } from 'vue-router'
import type { Form, Variant, Product } from '~~/utils/types'
import type { Ref } from 'vue'
import { useGetProductVariants } from '~~/utils/product-variants'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const product = ref<Product | null>(null)
const addons = ref<Variant[] | null>(null)

onMounted(async () => {
  const data = await useGetProduct(params.handle)
  product.value = data

  if (!product.value?.cutFee) return
  const datas = await useGetProductVariants([product.value.cutFee.value])
  addons.value = datas
})

const variants = computed(() => {
  if (!product.value) return []

  return product.value.variants.edges
    .map(({ node }) => node)
    .sort((a, b) => a.quantityAvailable - b.quantityAvailable)
})

const selectedVariant = computed(() => {
  return variants.value[0]
})
</script>
