import { useRuntimeConfig } from '#imports'

export const useShopifyUrl = () => {
  const config = useRuntimeConfig()
  return `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`
}

export const useShopifyOptions = (query: string, variables = {}) => {
  const config = useRuntimeConfig()
  return {
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/json' as const,
      'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken as string,
    },
    body: { query, variables },
  }
}