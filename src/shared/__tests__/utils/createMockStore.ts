import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import userSlice from '@/modules/Security/Users/slices/usersSice';

/**
 * Crea un store mock de Redux para testing
 * @param preloadedState Estado inicial opcional
 * @returns Store configurado para tests
 */
export const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      users: userSlice,
      // Agregar otros reducers según se necesiten
    },
    preloadedState: preloadedState as any,
  });
};

/**
 * Tipo del store mock
 */
export type MockStore = ReturnType<typeof createMockStore>;
