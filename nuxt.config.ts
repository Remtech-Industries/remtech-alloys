// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    siteUrl: 'https://remtechalloys.com',
    siteName: 'Rem-Tech Alloys',
  },
  robots: {
    disallow: ['/cart', '/mtr'],
  },
  imports: { autoImport: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/devtools',
    'nuxt-gtag',
    'nuxt-bugsnag',
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
  bugsnag: {
    baseUrl: 'https://remtechalloys.com',
    publishRelease: true,
    config: {
      apiKey: 'c3a9f5d2f4c102d10bdff8a53bffc6fa',
      enabledReleaseStages: ['production'],
      releaseStage: process.env.NODE_ENV,
    },
  },
})
