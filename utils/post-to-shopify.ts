export async function usePostToShopify(query: string, variables: any) {
  try {
    const result = await fetch(
      'https://remtech-dev.myshopify.com/api/2023-01/graphql.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token':
            'ca9a09f596e0d350accac97729f6d540',
        },
        body: JSON.stringify({ query, variables }),
      }
    ).then((res) => res.json())

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
