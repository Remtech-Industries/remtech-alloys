import { defineNuxtPlugin } from '#imports'
import Tailwind from '@/passthrough'
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { unstyled: true, pt: Tailwind })
})
