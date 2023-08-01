import { Shop } from '@/utils/storefront-api-types'
import { useShopifyHeaders, useShopifyUrl } from '@/composables/useShopify'
import { defineStore } from 'pinia'
import { ref, useFetch } from '#imports'

export const useShopStore = defineStore('shop', () => {
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
    const { data } = await useFetch<{ data: { shop: Shop } }>(useShopifyUrl(), {
      key: 'shop',
      method: 'POST',
      ...useShopifyHeaders(),
      body: { query },
    })

    if (data.value?.data.shop) {
      brand.value = data.value.data.shop.brand
    }
  }

  return { brand, getShop }
})
