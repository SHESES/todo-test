import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const viteSrc = './src'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, viteSrc),
      'personal-data': path.resolve(__dirname, './src/client/personal-data'),
      'main': path.resolve(__dirname, './src/client/main')
    }
  }
})
