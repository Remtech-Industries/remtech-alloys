<template>
  <div class="flex flex-col items-center justify-center p-10">
    <div v-if="showMessage" class="rounded border bg-slate-100 p-3">
      We could not find the MTR you are looking for. Please contact Rem-Tech
      Alloys for assistance.
    </div>

    <div
      v-if="productVariant && fileInfo"
      class="flex flex-col items-center justify-center p-10"
    >
      <div class="pb-2 font-oswald text-2xl font-bold text-slate-700">
        {{ productVariant.product.title }}
      </div>

      <div class="pb-4 text-xl">Bar ID: {{ productVariant.title }}</div>

      <a
        v-if="fileInfo?.url"
        :href="fileInfo.url"
        target="_blank"
        class="rounded bg-slate-800 p-3 text-slate-100 hover:bg-yellow-500"
      >
        Save MTR
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import { GenericFile, ProductVariant } from '@/utils/types'
import { onMounted, ref, useHead, useRoute } from '#imports'

type Variant = ProductVariant & {
  mtr: {
    value: string
  }
}

useHead({
  title: 'MTR Download',
})

const { query } = useRoute()
const variantId = ref(query.v)
const productVariant = ref<Variant | null>()
const fileInfo = ref<GenericFile>()
const showMessage = ref(false)

const getProductVariantQuery = `
query ($id: ID!) {
  node(id: $id) {
    id
    ... on ProductVariant {
      product {
        title
      }
      title
      mtr: metafield(namespace: "custom", key: "mtr") {
        value
      }
    }
  }
}
`
const getFileInfoQuery = `
query ($id: ID!) {
  node(id: $id) {
    ... on GenericFile {
      url
    }
  }
}
`

onMounted(async () => {
  if (!variantId.value) return

  // get the variant
  const variant = await $fetch<{ data: { node: Variant | null } }>(
    useShopifyUrl(),
    {
      ...useShopifyOptions(getProductVariantQuery, {
        id: `gid://shopify/ProductVariant/${variantId.value}`,
      }),
    },
  )

  if (!variant.data.node) {
    showMessage.value = true
    return
  }

  productVariant.value = variant.data.node

  if (!variant.data.node.mtr?.value) {
    showMessage.value = true
    return
  }

  // get the file info
  const file = await $fetch<{ data: { node: GenericFile | null } }>(
    useShopifyUrl(),
    {
      ...useShopifyOptions(getFileInfoQuery, {
        id: variant.data.node.mtr.value,
      }),
    },
  )

  if (!file.data.node?.url) {
    showMessage.value = true
    return
  }

  fileInfo.value = file.data.node
})
</script>
