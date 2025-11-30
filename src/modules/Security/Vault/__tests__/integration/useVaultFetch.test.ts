/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useVaultFetch } from '../../hooks/useVaultFetch';
import { IVaultService } from '../../services/IVaultService';
import { mockVaults } from '../fixtures/mockVault';

const createMockService = (): IVaultService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useVaultFetch Hook', () => {
  let mockService: IVaultService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'vault/clearVaults' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockVaults,
    });

    const { result } = renderHook(() => useVaultFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().vault.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useVaultFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
