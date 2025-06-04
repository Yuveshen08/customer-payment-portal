import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      
      key: readFileSync(path.resolve(__dirname, './certificate/private.key')),
      cert: readFileSync(path.resolve(__dirname, './certificate/Mycertificate.crt')),
    },
    port: 5173,
  },
})
