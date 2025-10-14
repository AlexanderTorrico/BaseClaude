import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

/**
 * Configuración para Unit Tests
 * Solo ejecuta tests en carpetas __tests__/unit/
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/__tests__/unit/**/*.test.ts', '**/__tests__/unit/**/*.test.tsx'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      coverage: {
        include: ['**/adapters/**', '**/slices/**', '**/models/**'],
      },
    },
  })
);
