// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, _res) => {
            console.error('Proxy error:', err);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api')
  },
  root: './'
});