<template>
  <span v-html="page?.body"></span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch, useRuntimeConfig, useHead } from '#imports'
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

const page = ref<Page>()

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

  page.value = data.value?.data.page
}

get()

const title = computed(() => page.value?.seo?.title || '')
const description = computed(() => page.value?.seo?.description || '')
useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>
