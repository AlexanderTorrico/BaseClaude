/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { usePaymentmethodsFetch } from '../../hooks/usePaymentmethodsFetch';
import { IPaymentmethodsService } from '../../services/IPaymentmethodsService';
import { mockPaymentmethodss } from '../fixtures/mockPaymentmethods';

const createMockService = (): IPaymentmethodsService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('usePaymentmethodsFetch Hook', () => {
  let mockService: IPaymentmethodsService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'paymentmethods/clearPaymentmethodss' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockPaymentmethodss,
    });

    const { result } = renderHook(() => usePaymentmethodsFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().paymentmethods.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => usePaymentmethodsFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
