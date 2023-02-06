<template>
  <div class="flex">
    <CollectionSidebar />

    <div class="flex flex-col gap-2 p-2">
      <h1 class="border-b text-2xl font-bold text-slate-700">
        {{ product.title }}
      </h1>

      <h2 class="font-semibold text-slate-700">Heat Numbers</h2>

      <div class="flex gap-1">
        <div
          v-for="{ node } in product.variants.edges"
          :key="node.id"
          class="rounded border border-slate-300 p-2"
        >
          <div>HT#: {{ node.title }}</div>

          <div class="text-xs font-thin">
            {{ node.quantityAvailable }}
            {{ node.priceV2.amount }}
          </div>
        </div>
      </div>

      <LengthInput
        v-model:is-valid="lengthIsValid"
        v-model:value="form.length"
      />

      <QuantityInput
        v-model:is-valid="quantityIsValid"
        v-model:value="form.quantity"
      />

      <AddToCartButton :form="form" :selectedVariant="selectedVariant" />

      <PricingTable :form="form" :variant="selectedVariant" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import AddToCartButton from '~~/components/AddToCartButton.vue'
import { computed, ref } from 'vue'
import { useFormatMoney } from '@/utils/format-money'
import { useGetProduct } from '@/utils/get-product'
import { useRoute } from 'vue-router'

const { params } = useRoute()

const form = ref({
  quantity: 1,
  length: 1,
})

// v-models for QuantityInput
const quantityIsValid = ref(true)

// v-models for LengthInput
const lengthIsValid = ref(false)

const { product } = await useGetProduct(params.handle)
const selectedVariant = ref(product.variants.edges[0].node)
</script>
