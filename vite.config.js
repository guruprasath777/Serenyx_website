import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves a project repo from /<repo>/, so every asset URL needs
// that prefix. Kept in one place: change it here if the repo is renamed or
// moved to a custom domain (for a domain, set base back to '/').
export default defineConfig({
  base: '/Serenyx_website/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    // three.js is by far the biggest dependency; splitting it out lets the
    // rest of the page cache independently of the 3D layer.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
});
