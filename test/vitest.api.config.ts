import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

/**
 * Configuración para API Tests
 * Solo ejecuta tests en carpetas __tests__/api/
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/__tests__/api/**/*.test.ts', '**/__tests__/api/**/*.test.tsx'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      coverage: {
        include: ['**/services/**'],
      },
    },
  })
);
