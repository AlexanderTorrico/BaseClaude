import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

/**
 * Configuración para Integration Tests
 * Solo ejecuta tests en carpetas __tests__/integration/
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/__tests__/integration/**/*.test.ts', '**/__tests__/integration/**/*.test.tsx'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      coverage: {
        include: ['**/controllers/**', '**/hooks/**'],
      },
    },
  })
);
