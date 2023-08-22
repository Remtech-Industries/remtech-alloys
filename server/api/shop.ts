import { defineEventHandler } from "h3"
import { useShopifyOptions, useShopifyUrl } from '@/composables/useShopify'
import { ShopResponse } from "utils/types"

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

export default defineEventHandler(async () => {

  const { data } = await $fetch<ShopResponse>(useShopifyUrl(), {
    ...useShopifyOptions(query),
  })

  return data
})