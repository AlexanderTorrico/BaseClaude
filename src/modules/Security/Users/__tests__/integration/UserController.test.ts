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
    it('debe obtener usuarios exitosamente', async () => {
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

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(1);
      expect(response.data?.[0]?.fullName).toBe('Juan Pérez');
    });

    it('debe manejar errores de red', async () => {
      // Arrange
      vi.mocked(userServices.getUsersByCompanyCall).mockReturnValue({
        call: Promise.reject(mockNetworkError),
        controller: new AbortController(),
      });

      // Act
      const response = await UserController.getUsersByCompany(1);

      // Assert
      expect(response.success).toBe(false);
      expect(response.error).toBe('Network error');
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
      expect(response.data).toMatchObject([
        { fullName: 'Juan Pérez', workStation: { dependencyId: 5 } },
        { fullName: 'María García', workStation: { dependencyId: 6 } },
      ]);
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
