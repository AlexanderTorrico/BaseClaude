const generateFixture = (moduleName) => `import { ${moduleName}Model } from '../../models/${moduleName}Model';

export const MOCK_${moduleName.toUpperCase()}S: ${moduleName}Model[] = [
  { id: 1 },
  { id: 2 },
];

export const mock${moduleName} = MOCK_${moduleName.toUpperCase()}S[0]!;
export const mock${moduleName}s = MOCK_${moduleName.toUpperCase()}S;
`;

const generateAdapterTest = (moduleName) => `import { describe, it, expect } from 'vitest';
import {
  adapt${moduleName}ResponseTo${moduleName}Model,
  adapt${moduleName}ArrayTo${moduleName}Models,
} from '../../adapters/${moduleName.toLowerCase()}Adapter';
import { mock${moduleName} } from '../fixtures/mock${moduleName}';

describe('${moduleName.toLowerCase()}Adapter', () => {
  describe('adapt${moduleName}ResponseTo${moduleName}Model', () => {
    it('debe mapear correctamente un elemento del API', () => {
      const apiData = { id: 1 };
      const result = adapt${moduleName}ResponseTo${moduleName}Model(apiData);
      expect(result.id).toBe(1);
    });
  });

  describe('adapt${moduleName}ArrayTo${moduleName}Models', () => {
    it('debe mapear array de elementos', () => {
      const apiArray = [{ id: 1 }, { id: 2 }];
      const result = adapt${moduleName}ArrayTo${moduleName}Models(apiArray);
      expect(result).toHaveLength(2);
    });
  });
});
`;

const generateSliceTest = (moduleName) => `import { describe, it, expect } from 'vitest';
import ${moduleName.toLowerCase()}Reducer, {
  set${moduleName}s,
  clear${moduleName}s,
} from '../../slices/${moduleName.toLowerCase()}Slice';
import { mock${moduleName}s } from '../fixtures/mock${moduleName}';

describe('${moduleName.toLowerCase()}Slice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('set${moduleName}s', () => {
    it('debe establecer la lista', () => {
      const newState = ${moduleName.toLowerCase()}Reducer(initialState, set${moduleName}s(mock${moduleName}s));

      expect(newState.list).toEqual(mock${moduleName}s);
      expect(newState.list).toHaveLength(2);
    });
  });

  describe('clear${moduleName}s', () => {
    it('debe limpiar la lista', () => {
      const stateWithData = { list: mock${moduleName}s, currentView: '0' };

      const newState = ${moduleName.toLowerCase()}Reducer(stateWithData, clear${moduleName}s());

      expect(newState.list).toEqual([]);
    });
  });
});
`;

const generateHookTest = (moduleName) => `/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { use${moduleName} } from '../../hooks/use${moduleName}';
import { set${moduleName}s } from '../../slices/${moduleName.toLowerCase()}Slice';
import { mock${moduleName}s } from '../fixtures/mock${moduleName}';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('use${moduleName} Hook', () => {
  beforeEach(() => {
    store.dispatch({ type: '${moduleName.toLowerCase()}/clear${moduleName}s' });
  });

  describe('Lectura de estado', () => {
    it('debe leer datos vacíos inicialmente', () => {
      const { result } = renderHook(() => use${moduleName}(), { wrapper });

      expect(result.current.${moduleName.toLowerCase()}s).toEqual([]);
    });

    it('debe leer datos cuando existen', () => {
      store.dispatch(set${moduleName}s(mock${moduleName}s));

      const { result } = renderHook(() => use${moduleName}(), { wrapper });

      expect(result.current.${moduleName.toLowerCase()}s).toHaveLength(2);
    });
  });

  describe('getTotal', () => {
    it('debe retornar el total de elementos', () => {
      store.dispatch(set${moduleName}s(mock${moduleName}s));

      const { result } = renderHook(() => use${moduleName}(), { wrapper });

      expect(result.current.getTotal()).toBe(2);
    });
  });
});
`;

const generateFetchTest = (moduleName) => `/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { use${moduleName}Fetch } from '../../hooks/use${moduleName}Fetch';
import { I${moduleName}Service } from '../../services/I${moduleName}Service';
import { mock${moduleName}s } from '../fixtures/mock${moduleName}';

const createMockService = (): I${moduleName}Service => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('use${moduleName}Fetch Hook', () => {
  let mockService: I${moduleName}Service;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: '${moduleName.toLowerCase()}/clear${moduleName}s' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mock${moduleName}s,
    });

    const { result } = renderHook(() => use${moduleName}Fetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().${moduleName.toLowerCase()}.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => use${moduleName}Fetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
`;

export {
  generateFixture,
  generateAdapterTest,
  generateSliceTest,
  generateHookTest,
  generateFetchTest,
};
