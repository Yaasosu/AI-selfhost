import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['react-syntax-highlighter', 'refractor'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    proxy: {
      '/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/chats': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/messages': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
