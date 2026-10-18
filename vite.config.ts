import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
