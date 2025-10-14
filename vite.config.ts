import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/helpers': resolve(__dirname, './src/helpers'),
      '@/store': resolve(__dirname, './src/store'),
      '@/models': resolve(__dirname, './src/models'),
      '@/assets': resolve(__dirname, './src/assets'),
      '@/test': resolve(__dirname, './test'),
      '@/shared/__tests__': resolve(__dirname, './src/shared/__tests__'),
    },
  },
})
