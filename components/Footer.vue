<template>
  <footer
    class="mt-auto w-full bg-slate-900 p-5 text-sm font-light text-slate-100"
  >
    <div class="flex h-full w-full flex-col gap-3">
      <div
        class="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10"
      >
        <a class="cursor-pointer" @click="showPolicy('privacyPolicy')">
          Privacy
        </a>

        <a class="cursor-pointer" @click="showPolicy('termsOfService')">
          Terms of Service
        </a>

        <a class="cursor-pointer" @click="showPolicy('shippingPolicy')">
          Shipping Policy
        </a>

        <a class="cursor-pointer" @click="showPolicy('refundPolicy')">
          Return Policy
        </a>

        <NuxtLink to="/about">Contact Us</NuxtLink>
      </div>

      <div class="text-center text-xs">
        &copy; {{ year }} Rem-Tech Alloys Inc. All rights reserved.
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

const year = new Date().getFullYear()
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
