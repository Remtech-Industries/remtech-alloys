import { useRuntimeConfig, useFetch, ref } from '#imports'

type ShopifyResponse<T> = {
  data?: T | null
  errors?: object[]
}


export function useShopify<T>(query: string, variables = {}) {
  const config = useRuntimeConfig()
  const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`

  const data = ref<T | null>()
  const status = ref()

  const doGet = async () => {
    const { data: d, error } = await useFetch<ShopifyResponse<T>>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
      },
      body: { query, variables },
    })

    // https://shopify.dev/docs/api/storefront#status_and_error_codes
    //
    // The Storefront API can return a 200 OK response code in cases that would typically produce 4xx errors in REST.
    // console logging data.value.errors can give you very good details to debug the response
    if (d.value?.errors) {
      console.error('Shopify Errors', { errors: d.value.errors })
    }

    if (d.value?.data) data.value = d.value?.data
    if (error.value) {
      console.error('error', error.value)
    }
  }

  return { data, doGet, status }
}
