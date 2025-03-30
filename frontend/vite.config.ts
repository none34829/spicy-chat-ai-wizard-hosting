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
    open: true
  },
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api')
  },
  publicDir: 'public'
});