import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/login':{
        target:"http://localhost:5000",
        changeOrigin:true
      },
      '/registration':{
        target:"http://localhost:5000",
        changeOrigin:true
      },
      '/chat':{
        target:"http://localhost:5000",
        changeOrigin:true

      }
    }
  }
})
