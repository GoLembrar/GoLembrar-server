import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    coverage: {
      provider: 'v8',
    },
    outputFile: {
      json: 'vitest/output/json/test.json',
      junit: 'vitest/output/junit/test.xml',
    },
  },
  plugins: [swc.vite()],
});
