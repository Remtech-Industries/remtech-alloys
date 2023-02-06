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
          <div>{{ useDisplayHeatNumber(node.title) }}</div>

          <div class="text-xs font-thin">
            {{ node.quantityAvailable }}
            {{ node.priceV2.amount }}
          </div>
        </div>
      </div>

      <LengthInput
        @update:is-valid="form.lengthIsValid = $event"
        @update:value="form.length = $event"
      />

      <QuantityInput
        @update:quantity="form.quantity = $event"
        @update:is-valid="form.quantityIsValid = $event"
      />

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
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import AddToCartButton from '~~/components/AddToCartButton.vue'
import PricingTable from '@/components/PricingTable.vue'
import { computed, ref } from 'vue'
import { useDisplayHeatNumber } from '~~/utils/display-heat-number'
import { useFormatMoney } from '@/utils/format-money'
import { useGetProduct } from '@/utils/get-product'
import { useRoute } from 'vue-router'
import type { Form } from '~~/utils/types'
import type { Ref } from 'vue'

const { params } = useRoute()

const form: Ref<Form> = ref({
  quantity: 0,
  quantityIsValid: false,
  length: 0,
  lengthIsValid: false,
})

const { product } = await useGetProduct(params.handle)
const selectedVariant = ref(product.variants.edges[0].node)
</script>
