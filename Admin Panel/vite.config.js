import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://admin-backend-h26r.onrender.com',
    }
  },
  plugins: [react()],
})
