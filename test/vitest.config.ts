import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from '../vite.config';

/**
 * Configuración base de Vitest
 * Hereda la configuración de Vite para mantener consistencia
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/shared/__tests__/setup/vitest.setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/shared/__tests__/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData.ts',
          'test/',
        ],
      },
    },
  })
);
