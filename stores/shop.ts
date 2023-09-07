import type { ShopResponse, Brand } from '@/utils/types'
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { defineStore } from 'pinia'
import { ref, useFetch } from '#imports'

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
}`

export const useShopStore = defineStore('shop', () => {
  const brand = ref<Brand>()

  async function getShop() {
    const { data } = await useFetch<ShopResponse>('/api/shop', {
      ...useShopifyOptions(query),
      key: 'shop',
    })

    if (data.value?.data?.shop?.brand) brand.value = data.value.data.shop.brand
  }

  return { brand, getShop }
})
