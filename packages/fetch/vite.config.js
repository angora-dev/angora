import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

// Track iterations over output files
let analyzePluginIterations = 0;

export default defineConfig({
  build: {
    outDir: './dist',
    lib: {
      entry: {
        build: resolve(__dirname, 'src/build/main.ts'),
        next: resolve(__dirname, 'src/next/main.ts'),
      },
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        // Node.js
        'crypto',
        'stream',
        'util',
        'fs',
        'buffer',
        'path',
        'os',

        // External libraries
        'react',
        'react/jsx-runtime',
        'webpack',

        // Next.js
        'next/router',
        'next/dist/build/analysis/extract-const-value',
        'next/dist/build/analysis/parse-module',
        'next/dist/build/output/log',
        'next/dist/shared/lib/page-path/normalize-path-sep',
        'next/dist/shared/lib/router/utils/sorted-routes',
        'next/dist/shared/lib/router/utils/route-regex',
      ],
      plugins: [
        analyze({
          summaryOnly: true,
          onAnalysis: () => {
            if (analyzePluginIterations > 0) {
              throw ''; // We only want reports on the first output
            }

            analyzePluginIterations++;
          },
        }),
        typescript(),
      ],
    },
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
  },
});
