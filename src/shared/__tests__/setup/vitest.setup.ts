import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from '../mocks/server';

/**
 * Setup global de Vitest
 * Se ejecuta antes de todos los tests
 */

// Establecer MSW server
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Limpiar después de cada test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Cerrar servidor MSW al finalizar
afterAll(() => {
  server.close();
});

// Mockear window.matchMedia (necesario para componentes responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mockear IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Suprimir errores de consola en tests (opcional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
