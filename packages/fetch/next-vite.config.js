import { resolve } from 'path';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist/next',
    lib: {
      entry: resolve(__dirname, 'lib/next/web.ts'),
      fileName: 'web',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'crypto',
        'next/router',
        'next/dist/shared/lib/router/utils/sorted-routes',
        'next/dist/shared/lib/router/utils/route-regex',
        'next/dist/shared/lib/router/utils/remove-trailing-slash',
      ],
      plugins: [analyze()],
    },
  },
});
