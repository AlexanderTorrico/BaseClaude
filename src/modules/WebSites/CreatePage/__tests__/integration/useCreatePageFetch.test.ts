/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useCreatePageFetch } from '../../hooks/useCreatePageFetch';
import { ICreatePageService } from '../../services/ICreatePageService';
import { mockCreatePages } from '../fixtures/mockCreatePage';

const createMockService = (): ICreatePageService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useCreatePageFetch Hook', () => {
  let mockService: ICreatePageService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'createpage/clearCreatePages' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockCreatePages,
    });

    const { result } = renderHook(() => useCreatePageFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().createpage.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useCreatePageFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
