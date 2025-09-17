import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@libsql/client': '/src/lib/__mocks__/client.js',
    },
  },
});
