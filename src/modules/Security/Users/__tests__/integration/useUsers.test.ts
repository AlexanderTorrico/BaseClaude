import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { createMockStore } from '@/shared/__tests__/utils/createMockStore';
import * as UserControllerModule from '../../controllers/UserController';
import { mockUserModel, createMockUser } from '../fixtures/mockUsers';

/**
 * Integration Tests para useUsers hook
 * Prueba la integración del hook con Redux y Controller
 */

// Mock del controller
vi.mock('../../controllers/UserController');

describe('useUsers', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (preloadedState?: any) => {
    const store = createMockStore(preloadedState);
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(Provider, { store }, children);
    };
    return Wrapper;
  };

  describe('Estado sincrónico desde Redux', () => {
    it('debe leer usuarios desde Redux', () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.users).toHaveLength(1);
      expect(result.current.users[0]).toEqual(mockUserModel);
    });

    it('debe leer el estado de loading desde Redux', () => {
      const wrapper = createWrapper({
        users: {
          list: [],
          loading: true,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.loading).toBe(true);
    });

    it('debe leer errores desde Redux', () => {
      const wrapper = createWrapper({
        users: {
          list: [],
          loading: false,
          error: 'Error de prueba',
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.error).toBe('Error de prueba');
    });
  });

  describe('fetchUsersByCompany - función asíncrona', () => {
    it('debe llamar al controller y retornar respuesta exitosa', async () => {
      const wrapper = createWrapper();

      const mockResponse = {
        success: true,
        data: [mockUserModel],
        loading: false,
      };

      vi.spyOn(UserControllerModule.UserController, 'getUsersByCompany').mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => useUsers(), { wrapper });

      const response = await result.current.fetchUsersByCompany(1);

      expect(response.success).toBe(true);
      expect(response.data).toEqual([mockUserModel]);
      expect(UserControllerModule.UserController.getUsersByCompany).toHaveBeenCalledWith(1);
    });

    it('debe usar caché cuando ya hay datos (force: false)', async () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      const spy = vi.spyOn(UserControllerModule.UserController, 'getUsersByCompany');

      const response = await result.current.fetchUsersByCompany(1);

      // No debe llamar al controller si hay datos en caché
      expect(spy).not.toHaveBeenCalled();
      expect(response.success).toBe(true);
      expect(response.data).toEqual([mockUserModel]);
    });

    it('debe forzar recarga cuando force: true', async () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const mockResponse = {
        success: true,
        data: [mockUserModel],
        loading: false,
      };

      vi.spyOn(UserControllerModule.UserController, 'getUsersByCompany').mockResolvedValue(
        mockResponse
      );

      const { result } = renderHook(() => useUsers(), { wrapper });

      await result.current.fetchUsersByCompany(1, { force: true });

      expect(UserControllerModule.UserController.getUsersByCompany).toHaveBeenCalledWith(1);
    });

    it('debe manejar errores del controller', async () => {
      const wrapper = createWrapper();

      const mockErrorResponse = {
        success: false,
        error: 'Error al cargar usuarios',
        loading: false,
      };

      vi.spyOn(UserControllerModule.UserController, 'getUsersByCompany').mockResolvedValue(
        mockErrorResponse
      );

      const { result } = renderHook(() => useUsers(), { wrapper });

      const response = await result.current.fetchUsersByCompany(1);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Error al cargar usuarios');
    });
  });

  describe('Funciones síncronas (lógica local)', () => {
    it('findUserByEmail debe encontrar usuario por email', () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      const foundUser = result.current.findUserByEmail('juan@example.com');

      expect(foundUser).toEqual(mockUserModel);
    });

    it('findUserByEmail debe retornar undefined si no existe', () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      const foundUser = result.current.findUserByEmail('noexiste@example.com');

      expect(foundUser).toBeUndefined();
    });

    it('findUserById debe encontrar usuario por ID', () => {
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      const foundUser = result.current.findUserById(1);

      expect(foundUser).toEqual(mockUserModel);
    });

    it('getTotalUsers debe retornar el total de usuarios', () => {
      const user2 = createMockUser({ id: 2, name: 'María' });
      const wrapper = createWrapper({
        users: {
          list: [mockUserModel, user2],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.getTotalUsers()).toBe(2);
    });

    it('getTotalUsers debe retornar 0 si no hay usuarios', () => {
      const wrapper = createWrapper({
        users: {
          list: [],
          loading: false,
          error: null,
        },
      });

      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.getTotalUsers()).toBe(0);
    });
  });
});
