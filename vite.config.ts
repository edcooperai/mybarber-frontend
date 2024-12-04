import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // The dev server will run on this port
    proxy: {
      '/api': {
        target: 'https://mybarber-backend-production.up.railway.app', // Correct remote API URL
        changeOrigin: true,  // Ensures the origin header is adjusted for the proxy
        secure: false,  // Allow insecure SSL (if necessary for testing)
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude this package from dependency optimization
  }
});
