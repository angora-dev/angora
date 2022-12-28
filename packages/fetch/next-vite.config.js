import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist/next',
    lib: {
      entry: resolve(__dirname, 'lib/next/with-angora-fetch.ts'),
      fileName: 'with-angora-fetch',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['crypto', 'webpack', 'stream', 'util', 'fs', 'buffer', 'path', 'os'],
    },
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
  },
});
