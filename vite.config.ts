import { defineConfig } from 'vitest/config';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single-file build: dist/index.html carries the dataset, styles and script inline so the tool
// works from file://, from any static host, and offline.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    target: 'es2022',
    cssMinify: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
