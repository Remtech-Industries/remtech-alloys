import { useRuntimeConfig } from 'nuxt/app'

export async function usePostToShopify(query: string, variables: any) {
  const config = useRuntimeConfig()
  const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-01/graphql.json`

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    // TODO: Figure out how to handle errors
    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log(error)
  }
}
