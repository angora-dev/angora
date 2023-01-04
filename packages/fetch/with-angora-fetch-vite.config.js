import { resolve } from 'path';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist/with-angora-fetch',
    lib: {
      entry: resolve(__dirname, 'lib/next/with-angora-fetch.ts'),
      fileName: 'with-angora-fetch',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'crypto',
        'webpack',
        'stream',
        'util',
        'fs',
        'buffer',
        'path',
        'os',
        'next/dist/build/analysis/extract-const-value',
        'next/dist/build/analysis/parse-module',
        'next/dist/build/output/log',
        'next/dist/shared/lib/page-path/normalize-path-sep',
        'next/dist/shared/lib/router/utils/sorted-routes',
        'next/dist/shared/lib/router/utils/route-regex',
        'next/dist/shared/lib/router/utils/remove-trailing-slash',
      ],
      plugins: [analyze()],
    },
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
  },
});
