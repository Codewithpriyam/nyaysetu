import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':              new URL('./src', import.meta.url).pathname,
      '@components':    new URL('./src/components', import.meta.url).pathname,
      '@pages':         new URL('./src/pages', import.meta.url).pathname,
      '@sections':      new URL('./src/sections', import.meta.url).pathname,
      '@features':      new URL('./src/features', import.meta.url).pathname,
      '@services':      new URL('./src/services', import.meta.url).pathname,
      '@store':         new URL('./src/store', import.meta.url).pathname,
      '@hooks':         new URL('./src/hooks', import.meta.url).pathname,
      '@utils':         new URL('./src/utils', import.meta.url).pathname,
      '@constants':     new URL('./src/constants', import.meta.url).pathname,
      '@data':          new URL('./src/data', import.meta.url).pathname,
      '@animations':    new URL('./src/animations', import.meta.url).pathname,
      '@styles':        new URL('./src/styles', import.meta.url).pathname,
    },
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks as function — required in Vite 8 / rolldown
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'animations';
          }
          if (id.includes('node_modules/@clerk')) {
            return 'auth';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'query';
          }
          if (id.includes('node_modules/zustand')) {
            return 'store';
          }
        },
      },
    },
  },
});
