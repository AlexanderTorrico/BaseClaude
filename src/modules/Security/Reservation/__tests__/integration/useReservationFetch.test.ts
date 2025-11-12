/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useReservationFetch } from '../../hooks/useReservationFetch';
import { IReservationService } from '../../services/IReservationService';
import { mockReservations } from '../fixtures/mockReservation';

const createMockService = (): IReservationService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useReservationFetch Hook', () => {
  let mockService: IReservationService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'reservation/clearReservations' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockReservations,
    });

    const { result } = renderHook(() => useReservationFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().reservation.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useReservationFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
