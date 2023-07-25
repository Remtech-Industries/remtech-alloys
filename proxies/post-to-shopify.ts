import { useRuntimeConfig } from '#imports'

export async function usePostToShopify(query: string, variables = {}) {
  const config = useRuntimeConfig()
  const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    // https://shopify.dev/docs/api/storefront#status_and_error_codes
    //
    // The Storefront API can return a 200 OK response code in cases that would typically produce 4xx errors in REST.
    // console logging results.errors can give you very good details to debug the response
    if (result.errors) {
      console.log('errors', { errors: result.errors })
    } else if (!result || !result.data) {
      console.log('usePostToShopify if', { result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log('usePostToShopify catch', error)
  }
}
