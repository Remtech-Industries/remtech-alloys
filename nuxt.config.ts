// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: { autoImport: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/devtools',
    'nuxt-gtag',
  ],
  extends: ['nuxt-seo-kit'],
  routeRules: {
    '/about': { prerender: true },
    '/cart': { index: false },
    '/mtr': { index: false },
  },
  runtimeConfig: {
    public: {
      shopifyStore: process.env.SHOPIFY_STORE,
      publicAccessToken: process.env.PUBLIC_ACCESS_TOKEN,
      siteUrl: 'https://remtechalloys.com',
      siteName: 'Rem-Tech Alloys',
      siteDescription:
        'Offering Prompt Delivery of Custom-Sized Stainless Steels and Specialty Alloys',
    },
  },
  build: { transpile: ['primevue'] },
  css: [
    'primevue/resources/themes/saga-blue/theme.css',
    'primevue/resources/primevue.css',
  ],
  app: {
    head: {
      style: [{ children: 'body { background-color: #f8fafc }' }],
    },
  },
})
