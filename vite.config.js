import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import path from 'path'

const flowsDir = existsSync(path.resolve(__dirname, 'src/flows/index.js'))
  ? path.resolve(__dirname, 'src/flows')
  : path.resolve(__dirname, 'src/flows-sample')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@flows': flowsDir,
    },
  },
})
