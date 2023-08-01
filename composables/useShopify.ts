import { useRuntimeConfig } from '#imports'

export const useShopifyUrl = () => {
  const config = useRuntimeConfig()
  return `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`
}

export const useShopifyHeaders = () => {
  const config = useRuntimeConfig()
  return {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
    }
  }
}