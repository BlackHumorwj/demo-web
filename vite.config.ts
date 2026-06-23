import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    base: isProd ? '/demo-web/' : '/',
    define: {
      __APP_BASE__: JSON.stringify(isProd ? '/demo-web/' : '/')
    }
  }
})
