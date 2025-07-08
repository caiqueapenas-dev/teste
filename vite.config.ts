import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona requisições que começam com /api
      '/api': {
        target: 'https://carloshenrique.dev.br', // Seu servidor real
        changeOrigin: true, // Necessário para o host virtual
        secure: false,      // Se o seu servidor de destino tem um certificado SSL válido
      },
    },
  },
})