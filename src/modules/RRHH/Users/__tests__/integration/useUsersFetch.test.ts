/** @jsxImportSource react */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useUsersFetch } from '../../hooks/useUsersFetch';
import { IUserService } from '../../services/IUserService';
import { mockUsers } from '../fixtures/mockUsers';

/**
 * Integration Tests para useUsersFetch hook
 * Prueba la integración del hook con el servicio y Redux
 */

// Mock service
const createMockService = (): IUserService => ({
  getUsersByCompany: vi.fn(),
});

// Helper para renderizar hooks con Provider
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useUsersFetch Hook', () => {
  let mockService: IUserService;

  beforeEach(() => {
    mockService = createMockService();
    store.dispatch({ type: 'users/clearUsers' });
    vi.clearAllMocks();
  });

  describe('Fetch exitoso', () => {
    it('debe obtener usuarios y actualizar Redux', async () => {
      vi.mocked(mockService.getUsersByCompany).mockResolvedValue({
        status: 200,
        message: 'Success',
        data: mockUsers,
      });

      const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });

      await act(async () => {
        await result.current.fetchUsersByCompany(1);
      });

      expect(mockService.getUsersByCompany).toHaveBeenCalledWith(1, expect.any(Function));
      expect(store.getState().users.list).toHaveLength(2);
      expect(store.getState().users.list[0]?.fullName).toBe('Juan Pérez');
    });

    it('debe manejar respuesta vacía', async () => {
      vi.mocked(mockService.getUsersByCompany).mockResolvedValue({
        status: 200,
        message: 'Success',
        data: [],
      });

      const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });

      await act(async () => {
        await result.current.fetchUsersByCompany(1);
      });

      expect(store.getState().users.list).toEqual([]);
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar error del servidor', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(mockService.getUsersByCompany).mockResolvedValue({
        status: 500,
        message: 'Internal server error',
        data: [],
      });

      const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });

      await act(async () => {
        await result.current.fetchUsersByCompany(1);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[500] Internal server error')
      );
      expect(store.getState().users.list).toHaveLength(0);

      consoleErrorSpy.mockRestore();
    });

    it('debe manejar error 404', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(mockService.getUsersByCompany).mockResolvedValue({
        status: 404,
        message: 'Not found',
        data: [],
      });

      const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });

      await act(async () => {
        await result.current.fetchUsersByCompany(1);
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(store.getState().users.list).toHaveLength(0);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Estado de loading', () => {
    it('debe inicializar con loading en false', () => {
      const { result } = renderHook(() => useUsersFetch(mockService), { wrapper });

      expect(result.current.loading).toBe(false);
    });
  });
});
