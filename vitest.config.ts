import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default {
  plugins: [vue()],
  test: { environment: 'jsdom' },
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
}
