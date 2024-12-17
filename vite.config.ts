/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {},
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
    port: 4000,
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: 'src', replacement: resolve(__dirname, './src') },
    ],
  },
})
