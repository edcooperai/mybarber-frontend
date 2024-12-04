import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    proxy: {
      '/api': {
        target: 'https://mybarber-backend-production.up.railway.app', 
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
