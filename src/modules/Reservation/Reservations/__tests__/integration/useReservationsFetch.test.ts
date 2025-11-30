/** @jsxImportSource react */
import React from 'vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useReservationsFetch } from '../../hooks/useReservationsFetch';
import { IReservationsService } from '../../services/IReservationsService';
import { mockReservationss } from '../fixtures/mockReservations';

const createMockService = (): IReservationsService => ({
  getAll: vi.fn(),
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useReservationsFetch Hook', () => {
  let mockService: IReservationsService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'reservations/clearReservationss' });
    vi.clearAllMocks();
  });

  it('debe obtener datos exitosamente', async () => {
    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 200,
      message: 'Success',
      data: mockReservationss,
    });

    const { result } = renderHook(() => useReservationsFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(mockService.getAll).toHaveBeenCalled();
    expect(store.getState().reservations.list).toHaveLength(2);
  });

  it('debe manejar errores', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getAll).mockResolvedValue({
      status: 500,
      message: 'Error',
      data: [],
    });

    const { result } = renderHook(() => useReservationsFetch(mockService), { wrapper });

    await act(async () => {
      await result.current.fetchAll();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
