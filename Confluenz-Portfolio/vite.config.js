import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://user-backend-88rd.onrender.com',
    }
  },
  plugins: [react()],
})
