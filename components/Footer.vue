<template>
  <footer
    class="mt-auto h-20 w-full bg-slate-900 p-5 text-sm font-light text-slate-100"
  >
    <div class="flex h-full w-full flex-col gap-3">
      <div class="flex items-center justify-center gap-10">
        <div @click="showPolicy('privacyPolicy')">Privacy</div>
        <div @click="showPolicy('termsOfService')">Terms of Service</div>
        <div @click="showPolicy('shippingPolicy')">Shipping Policy</div>
        <div @click="showPolicy('refundPolicy')">Return Policy</div>
        <div>Contact Us</div>
      </div>
      <div class="text-center">
        &copy; 2023 Rem-Tech Alloys Inc. All rights reserved.
      </div>
    </div>

    <Dialog
      :visible="!!words"
      modal
      @update:visible="words = null"
      :header="header"
    >
      <p v-html="words"></p>
    </Dialog>
  </footer>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { useShopifyUrl, useShopifyOptions } from '@/composables/useShopify'
import { useFetch, ref } from '#imports'
import type { ShopifyResponse, Shop } from '@/utils/types'

type ShopPolicyResponse = ShopifyResponse<{
  shop?: Pick<
    Shop,
    'refundPolicy' | 'privacyPolicy' | 'shippingPolicy' | 'termsOfService'
  >
}>

type PolicyName =
  | 'refundPolicy'
  | 'privacyPolicy'
  | 'shippingPolicy'
  | 'termsOfService'

const words = ref<string | null>(null)
const header = ref('')

const query = `
query {
  shop {
    privacyPolicy {
      body
      title
    }
    refundPolicy {
      title
      body
    }
    shippingPolicy {
      body
      title
    }
    termsOfService {
      body
      title
    }
  }
}
`

async function showPolicy(handle: PolicyName) {
  if (!data.value) await execute()

  const policy = data.value?.data?.shop?.[handle]
  if (policy) {
    words.value = policy.body
    header.value = policy.title
  }
}

const { data, execute } = useFetch<ShopPolicyResponse>(useShopifyUrl(), {
  ...useShopifyOptions(query),
  key: 'shopPolicy',
  lazy: true,
  server: false,
  immediate: false,
})
</script>
