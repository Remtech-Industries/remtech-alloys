<template>
  <div>
    <span v-if="d" v-html="d.body"></span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFetch, useRuntimeConfig } from '#imports'
import { Page } from '@/utils/storefront-api-types'

const config = useRuntimeConfig()
const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`

const string = `
query getPage($handle: String!) {
  page(handle: $handle) {
    id
    body
    bodySummary
    createdAt
    handle
    onlineStoreUrl
    seo {
      description
      title
    }
    title
    trackingParameters
    updatedAt
  }
}
`

const d = ref<Page>()

const get = async () => {
  const { data } = await useFetch<{ data: { page: Page } }>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
    },
    body: {
      query: string,
      variables: { handle: 'rfq' },
    },
  })

  console.log(data.value)
  d.value = data.value?.data.page
}

get()
</script>
