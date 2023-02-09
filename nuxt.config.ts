// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    autoImport: false,
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/devtools'],
  runtimeConfig: {
    public: {
      shopifyStore: process.env.SHOPIFY_STORE,
      publicAccessToken: process.env.PUBLIC_ACCESS_TOKEN,
    },
  },
})
