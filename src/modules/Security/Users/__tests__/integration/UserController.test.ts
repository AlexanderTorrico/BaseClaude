import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserController } from '../../controllers/UserController';
import { store } from '@/store';
import * as userServices from '../../services/userServices';
import {
  mockApiUser,
  mockApiUserWithAvatar,
  mockNetworkError,
  mockAuthError,
  mockApiNullDataResponse,
} from '../fixtures/mockUsers';

/**
 * Integration Tests para UserController
 * Prueba la integración entre Controller, Service, Adapter y Redux
 */

// Mock del servicio
vi.mock('../../services/userServices');

describe('UserController', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();

    // Limpiar Redux store
    store.dispatch({ type: 'users/clearUsers' });
  });

  describe('getUsersByCompany', () => {
    it('debe obtener usuarios exitosamente y actualizar Redux', async () => {
      // Arrange
      const mockApiResponse = {
        data: {
          data: [mockApiUser],
        },
      };

      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.resolve(mockApiResponse as any),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert - Respuesta del controller
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
      expect(response.data?.[0].fullName).toBe('Juan Pérez');
      expect(response.error).toBeUndefined();

      // Assert - Estado de Redux
      const state = store.getState();
      expect(state.users.list).toHaveLength(1);
      expect(state.users.list[0].fullName).toBe('Juan Pérez');
      expect(state.users.loading).toBe(false);
      expect(state.users.error).toBeNull();
    });

    it('debe manejar errores de red correctamente', async () => {
      // Arrange
      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.reject(mockNetworkError),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert - Respuesta del controller
      expect(response.success).toBe(false);
      expect(response.error).toBe('Network error');
      expect(response.data).toBeUndefined();

      // Assert - Estado de Redux
      const state = store.getState();
      expect(state.users.loading).toBe(false);
      expect(state.users.error).toBe('Network error');
      expect(state.users.list).toHaveLength(0);
    });

    it('debe manejar error 401 (no autorizado)', async () => {
      // Arrange
      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.reject(mockAuthError),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert
      expect(response.success).toBe(false);
      expect(response.error).toBe('Token inválido o expirado');

      // Verificar que el estado de Redux refleja el error
      const state = store.getState();
      expect(state.users.error).toBe('Token inválido o expirado');
    });

    it('debe manejar respuesta del API sin datos', async () => {
      // Arrange
      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.resolve(mockApiNullDataResponse as any),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);

      const state = store.getState();
      expect(state.users.list).toEqual([]);
    });

    it('debe mapear correctamente múltiples usuarios', async () => {
      // Arrange
      const mockApiResponse = {
        data: {
          data: [mockApiUser, mockApiUserWithAvatar],
        },
      };

      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.resolve(mockApiResponse as any),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert
      expect(response.data).toHaveLength(2);
      expect(response.data?.[0].fullName).toBe('Juan Pérez');
      expect(response.data?.[1].fullName).toBe('María García');

      // Verificar transformación de workStation (snake_case → camelCase)
      expect(response.data?.[0].workStation.dependencyId).toBe(5);
      expect(response.data?.[1].workStation.dependencyId).toBe(6);
    });

    it('debe activar loading antes de hacer la petición', async () => {
      // Arrange
      let loadingStateDuringCall = false;

      const mockApiResponse = {
        data: { data: [] },
      };

      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: new Promise((resolve) => {
          // Capturar el estado de loading durante la llamada
          setTimeout(() => {
            loadingStateDuringCall = store.getState().users.loading;
            resolve(mockApiResponse as any);
          }, 10);
        }),
        controller: new AbortController(),
      });

      // Act
      await UserController.getUsersByCompany(1);

      // Assert
      expect(loadingStateDuringCall).toBe(true);
      expect(store.getState().users.loading).toBe(false);
    });
  });
});
