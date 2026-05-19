import { defineConfig } from 'vite';

const SERVER_PORT = process.env.PORT || 3001;

export default defineConfig({
  base: '/ai-consultant/',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
