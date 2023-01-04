import { resolve } from 'path';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist/main',
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      fileName: 'main',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'crypto', 'next/router'],
      plugins: [analyze()],
    },
  },
});
