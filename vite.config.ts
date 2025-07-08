import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona requisições que começam com /api
      '/api': {
        target: 'http://carloshenriquesilva.com', // <-- ✅ SUA URL CORRETA
        changeOrigin: true,
        secure: false,
      },
    },
  },
})