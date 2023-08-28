import { defineNuxtPlugin } from '#imports'
import PrimeVue from 'primevue/config'
import { tailwind } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: true,
    pt: tailwind,
  })
})
