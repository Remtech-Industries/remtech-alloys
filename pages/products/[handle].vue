<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="flex flex-col gap-2 p-2">
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
          :stockingUnit="product.stockingUnit.value"
        />
      </div>

      <div>
        <LengthInput
          @update:length="form.length = $event"
          @update:is-valid="form.lengthIsValid = $event"
        />
      </div>

      <div>
        <QuantityInput
          @update:quantity="form.quantity = $event"
          @update:is-valid="form.quantityIsValid = $event"
        />
      </div>

      <AddToCartButton :form="form" :selectedVariant="selectedVariant" />

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
import { computed, ref, watch } from 'vue'
import { useGetProduct } from '@/utils/get-product'
import { useRoute } from 'vue-router'
import type { Form, Variant } from '~~/utils/types'
import type { Ref } from 'vue'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const { product } = await useGetProduct(params.handle)

const variants = computed(() => {
  return product.variants.edges
    .map(({ node: variant }: { node: Variant }) => variant)
    .sort((a: Variant, b: Variant) => a.quantityAvailable - b.quantityAvailable)
})

const selectedVariant = ref(variants.value[0])
</script>
