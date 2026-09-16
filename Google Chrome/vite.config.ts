import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    crx({ manifest }),
  ],
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
});