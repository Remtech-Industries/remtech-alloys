<template>
  <span class="custom-page-css" v-html="page?.body"></span>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  definePageMeta,
  useFetch,
  useRuntimeConfig,
  useRoute,
  useHead,
} from '#imports'
import { Page } from '@/utils/storefront-api-types'

definePageMeta({
  layout: 'page',
})

const config = useRuntimeConfig()
const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`

const { params } = useRoute()
const pageHandle = Array.isArray(params.pageHandle)
  ? params.pageHandle[0]
  : params.pageHandle

const string = `
query getPage($handle: String!) {
  page(handle: $handle) {
    id
    body
    handle
    onlineStoreUrl
    seo {
      description
      title
    }
    title
  }
}
`

const page = ref<Page>()

const get = async () => {
  const { data } = await useFetch<{ data: { page: Page } }>(url, {
    key: 'page',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
    },
    body: {
      query: string,
      variables: { handle: pageHandle },
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

<style scoped>
.custom-page-css :deep() {
  h1 {
    @apply text-3xl font-bold text-slate-700;
  }
  h2 {
    @apply text-2xl font-bold text-slate-700;
  }
  h3 {
    @apply text-xl font-bold text-slate-700;
  }
  p {
    @apply text-slate-700;
  }
}
</style>
