import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createMockStore, MockStore } from './createMockStore';
import type { RootState } from '@/store';

/**
 * Opciones extendidas para renderizado con providers
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: MockStore;
}

/**
 * Renderiza un componente con todos los providers necesarios
 * Útil para tests de componentes que usan Redux, Router, etc.
 *
 * @example
 * ```ts
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   preloadedState: { users: { list: [...] } }
 * });
 * ```
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Re-exportar todo de @testing-library/react
 */
export * from '@testing-library/react';
