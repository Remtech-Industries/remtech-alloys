// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    siteUrl: 'https://remtechalloys.com',
    siteName: 'Rem-Tech Alloys',
  },

  // this typescript config is temporary until we refactor as necessary
  // See sub-heading "Type import changes" https://github.com/nuxt/nuxt/releases/tag/v3.8.0
  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false,
      },
    },
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
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://remtechalloys.com',
      siteName: 'Rem-Tech Alloys',
      siteDescription:
        'Offering Prompt Delivery of Custom-Sized Stainless Steels and Specialty Alloys',
    },
  },

  build: { transpile: ['primevue'] },

  bugsnag: {
    baseUrl: 'https://remtechalloys.com',
    publishRelease: true,
    config: {
      apiKey: 'c3a9f5d2f4c102d10bdff8a53bffc6fa',
      enabledReleaseStages: ['production'],
      releaseStage: process.env.NODE_ENV,
    },
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
})
