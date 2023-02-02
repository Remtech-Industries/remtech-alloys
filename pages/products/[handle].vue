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

      <LengthInput v-model:is-valid="lengthIsValid" v-model:value="length" />

      <QuantityInput
        v-model:is-valid="quantityIsValid"
        v-model:value="quantity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import { computed, ref } from 'vue'
import { useFormatMoney } from '@/utils/format-money'
import { useGetProduct } from '@/utils/get-product'
import { useRoute } from 'vue-router'

const { params } = useRoute()

// v-models for QuantityInput
const quantity = ref(1)
const quantityIsValid = ref(true)

// v-models for LengthInput
const length = ref(1)
const lengthIsValid = ref(false)

const submitDisabled = computed(
  () => !quantityIsValid.value || !lengthIsValid.value
)

const { product } = await useGetProduct(params.handle)
</script>
