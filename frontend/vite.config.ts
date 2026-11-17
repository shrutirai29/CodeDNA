import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three') || id.includes('node_modules\\three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules\\framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules\\lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
