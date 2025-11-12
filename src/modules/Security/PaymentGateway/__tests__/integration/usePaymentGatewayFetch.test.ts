/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { usePaymentGatewayFetch } from '../../hooks/usePaymentGatewayFetch';
import { IPaymentGatewayService } from '../../services/IPaymentGatewayService';
import { mockPaymentGateways } from '../fixtures/mockPaymentGateway';

const createMockService = (): IPaymentGatewayService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('usePaymentGatewayFetch Hook', () => {
  let mockService: IPaymentGatewayService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'paymentgateway/clearPaymentGateways' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockPaymentGateways,
    });

    const { result } = renderHook(() => usePaymentGatewayFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().paymentgateway.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => usePaymentGatewayFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
