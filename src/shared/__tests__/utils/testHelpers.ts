import { waitFor } from '@testing-library/react';

/**
 * Utilidades generales para testing
 */

/**
 * Espera a que una condición se cumpla con timeout configurable
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 3000
): Promise<void> => {
  await waitFor(() => expect(condition()).toBe(true), { timeout });
};

/**
 * Simula un delay (útil para tests async)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mockea localStorage
 */
export const createLocalStorageMock = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

/**
 * Setup mock de localStorage
 */
export const setupLocalStorageMock = () => {
  const localStorageMock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

/**
 * Genera datos de prueba aleatorios
 */
export const generateRandomId = (): number => {
  return Math.floor(Math.random() * 10000);
};

export const generateRandomEmail = (): string => {
  return `test${generateRandomId()}@example.com`;
};

/**
 * Helper para esperar actualizaciones de Redux
 */
export const waitForReduxUpdate = async (callback: () => void, delay = 100) => {
  callback();
  await new Promise(resolve => setTimeout(resolve, delay));
};
