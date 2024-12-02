import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://mybarber-backend-production.up.railway.app', // Replace with your production backend URL
        changeOrigin: true,
        secure: true  // Set to true if the backend uses HTTPS
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    outDir: 'dist'  // Ensure output folder is set to 'dist'
  }
});
