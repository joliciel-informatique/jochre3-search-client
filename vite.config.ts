import { fileURLToPath, URL } from 'node:url'
import path from 'path'
// import tsconfigPaths from 'vite-tsconfig-paths'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
      bulma: fileURLToPath(new URL('./node_modules/bulma', import.meta.url))
      // '/^~(.*)$/': fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  }
})
