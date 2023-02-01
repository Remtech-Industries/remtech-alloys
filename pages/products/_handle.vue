<template>
  <div class="w-full px-3 py-2">
    <div class="flex flex-col gap-2 p-2">
      <h1 class="border-b text-2xl font-bold text-slate-700">
        {{ product.title }}
      </h1>

      <h2 class="font-semibold text-slate-700">Heat Numbers</h2>

      <!-- Variant Selection -->
      <div class="flex flex-wrap gap-2">
        <a
          v-for="variant in productVariants"
          :key="variant.id"
          :href="variant.url"
          class="rounded border border-slate-300 p-2"
          :class="activeVariantClasses(variant)"
        >
          <div>HT#: {{ variant.title }}</div>

          <div class="text-xs font-thin">
            <p>
              {{ variant.inventory_quantity }}
              {{ stockingUnit }}@{{ useFormatMoney(variant.price) }}
            </p>

            <p v-if="stockingUnit === 'mm'">
              {{ +(variant.inventory_quantity / 25.4).toFixed(2) }}in@
              {{ useFormatMoney(variant.price * 25.4) }}
            </p>

            <p v-else-if="stockingUnit === 'cm'">
              {{ +(variant.inventory_quantity / 2.54).toFixed(2) }}in@
              {{ useFormatMoney(variant.price * 2.54) }}
            </p>
          </div>
        </a>
      </div>

      <!-- Selected Variant Details -->
      <div
        class="flex flex-col rounded border border-slate-300 bg-slate-50 p-2 text-slate-700"
      >
        <p>Heat Number: {{ selectedVariant.title }}</p>

        <p>{{ useFormatMoney(selectedVariant.price) }}/{{ stockingUnit }}</p>

        <p v-if="stockingUnit === 'mm'">
          {{ useFormatMoney(selectedVariant.price * 25.4) }}/in
        </p>

        <p v-else-if="stockingUnit === 'cm'">
          {{ useFormatMoney(selectedVariant.price * 2.54) }}/in
        </p>
      </div>

      <div v-cloak class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <div class="flex flex-col">
          <!-- Inputs -->
          <QuantityInput
            v-model:value="quantity"
            v-model:isValid="quantityIsValid"
          />

          <LengthInput v-model:value="length" v-model:isValid="lengthIsValid" />

          <!-- Submit -->
          <button
            class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300 focus:bg-slate-300"
            @click="addToCart()"
            :disabled="submitDisabled"
          >
            Add To Cart
          </button>
        </div>

        <!-- Pricing Table  -->
        <table
          v-cloak
          v-if="pricingTable.length > 0"
          class="w-full text-sm text-slate-700"
        >
          <thead
            class="bg-slate-100 text-left text-xs uppercase text-slate-700"
          >
            <tr>
              <th class="px-6 py-3">Item</th>
              <th class="px-6 py-3">Each</th>
              <th class="px-6 py-3">Qty</th>
              <th class="px-6 py-3">Price</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in pricingTable" :key="row.id">
              <td class="border-b px-6 py-2 font-medium text-slate-700">
                {{ row.title }}
              </td>
              <td class="border-b px-6 py-2 font-medium text-slate-700">
                {{ row.each }}
              </td>
              <td
                class="border-b px-6 py-2 text-center font-medium text-slate-700"
              >
                {{ row.quantity }}
              </td>
              <td
                class="border-b px-6 py-2 text-right font-medium text-slate-700"
              >
                {{ row.price }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LengthInput from '@/components/LengthInput.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import { computed, ref } from 'vue'
import { useFormatMoney } from '@/utils/format-money'
import { usePricingTable } from '@/utils/pricing-table'

// v-models for QuantityInput
const quantity = ref(1)
const quantityIsValid = ref()

// v-models for LengthInput
const length = ref()
const lengthIsValid = ref()

const submitDisabled = computed(
  () => !quantityIsValid.value || !lengthIsValid.value
)

const form = computed(() => {
  return {
    quantity: quantity.value,
    quantityIsValid: quantityIsValid.value,
    length: length.value,
    lengthIsValid: lengthIsValid.value,
  }
})

// TODO: get product using GraphQL API
const product: any = ref(null)

// TODO: sort variants by inventory_quantity
const productVariants = computed(() => product.variants.edges)

const selectedVariant = computed(
  () => product.selected_or_first_available_variant
)
const stockingUnit = computed(
  () => product.metafields.custom.stocking_unit.value.first
)

// TODO: figure out where cutFee comes from
const cutFee = ref()
const pricingTable = computed(() =>
  usePricingTable({
    form: form.value,
    selectedVariant: selectedVariant.value,
    cutFee: cutFee.value,
  })
)

function activeVariantClasses(variant: any) {
  if (variant.id === product.selected_or_first_available_variant.id)
    return 'bg-slate-700 text-slate-50 shadow-lg'
  return 'bg-slate-50 text-slate-700'
}

function addToCart() {
  // TODO
}
</script>
