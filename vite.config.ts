/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
   define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '@environments': resolve(__dirname, 'src/environments'),
      "@api": resolve(__dirname, "src/api"),
    },
  },
})
