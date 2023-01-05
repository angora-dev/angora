import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

// Track iterations over output files
let analyzePluginIterations = 0;

export default defineConfig({
  build: {
    minify: true,
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: 'main',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['crypto'],
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
  },
});
