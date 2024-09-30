import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const nonce = mode === 'development' ? 'nonce' : 'NGINX_CSP_NONCE'

  // regex'es to add CSP
  const regexScript = /<script(.*?)/gi
  const replacementScript = `<script nonce="${nonce}"$1`

  const regexStyle = /<style(.*?)/gi
  const replacementStyle = `<style nonce="${nonce}"$1`

  const regexLink = /<link(.*?)/gi
  const replacementLink = `<link nonce="${nonce}"$1`

  return {
    plugins: [
      vue(),
      {
        name: 'html-inject-nonce-into-script-tag',
        enforce: 'post',
        transformIndexHtml(html) {
          return html
            .replace(regexScript, replacementScript)
            .replace(regexStyle, replacementStyle)
            .replace(regexLink, replacementLink)
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
