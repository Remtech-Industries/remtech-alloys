import { Shop } from '@/utils/storefront-api-types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRuntimeConfig, useFetch } from '#imports'

export const useShopStore = defineStore('shop', () => {
  const config = useRuntimeConfig()
  const url = `https://${config.public.shopifyStore}.myshopify.com/api/2023-07/graphql.json`

  const query = `
    query {
      shop {
        brand {
          logo {
            id
            image {
              url
            }
          }
          slogan
        }
      }
    }
  `

  const brand = ref<Shop['brand']>()

  async function getShop() {
    const { data } = await useFetch<{ data: { shop: Shop } }>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.publicAccessToken,
      },
      body: { query },
    })

    brand.value = data.value?.data.shop.brand
  }

  return { brand, getShop }
})
