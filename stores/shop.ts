import { Shop } from '@/utils/storefront-api-types'
import { defineStore } from 'pinia'
import { ref } from '#imports'
import { useShopify } from '@/proxies/shopify'

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
    const { data, doGet } = useShopify<{ shop: Shop }>(query)

    await doGet()

    if (data.value?.shop) {
      brand.value = data.value.shop.brand
    }
  }

  return { brand, getShop }
})
