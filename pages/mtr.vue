<template>
  <div class="flex flex-col items-center justify-center p-10">
    <div v-if="!variantId" class="rounded border bg-slate-100 p-3">
      Something seems to have gone wrong. Please call Rem-Tech Alloys for
      assistance.

      <p class="pt-3">Error: No variant ID found.</p>
    </div>

    <div
      v-if="productVariant"
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

      <div v-else>Seems to be no MTR file for this variant.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostToShopify } from '@/proxies/post-to-shopify'
import { GenericFile, ProductVariant } from '@/utils/storefront-api-types'
import { onMounted, ref, useHead, useRoute } from '#imports'

useHead({
  title: 'MTR Download',
})

const { query } = useRoute()
const variantId = ref(query.v)
const productVariant = ref<ProductVariant>()
const fileInfo = ref<GenericFile>()

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

  const { node: p } = await usePostToShopify(getProductVariantQuery, {
    id: `gid://shopify/ProductVariant/${variantId.value}`,
  })

  productVariant.value = p

  if (!p.mtr.value) return

  const { node: f } = await usePostToShopify(getFileInfoQuery, {
    id: p.mtr.value,
  })

  fileInfo.value = f
})
</script>
