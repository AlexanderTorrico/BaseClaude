import { describe, it, expect } from 'vitest';
import {
  adaptUserResponseToUserModel,
  adaptUsersArrayToUserModels,
} from '../../adapters/userAdapter';
import {
  mockApiUser,
  mockApiUserWithAvatar,
  mockApiUserEmptyNames,
  mockUserModel,
  mockUserEmptyNames,
} from '../fixtures/mockUsers';

/**
 * Unit Tests para userAdapter
 * Prueba la transformación de datos del API al modelo de UI
 */

describe('userAdapter', () => {
  describe('adaptUserResponseToUserModel', () => {
    it('debe mapear correctamente un usuario del API al modelo de UI', () => {
      // Act
      const result = adaptUserResponseToUserModel(mockApiUser);

      // Assert
      expect(result).toEqual(mockUserModel);
    });

    it('debe manejar nombres vacíos correctamente', () => {
      const result = adaptUserResponseToUserModel(mockApiUserEmptyNames);

      expect(result).toEqual(mockUserEmptyNames);
      expect(result.fullName).toBe('');
      expect(result.name).toBe('');
      expect(result.lastName).toBe('');
    });

    it('debe mapear correctamente workStation con snake_case a camelCase', () => {
      const result = adaptUserResponseToUserModel(mockApiUser);

      expect(result.workStation).toEqual({
        id: 1,
        name: 'Developer',
        level: 2,
        dependencyId: 5,
      });
    });

    it('debe manejar valores null en phone y avatar', () => {
      const result = adaptUserResponseToUserModel(mockApiUser);

      expect(result.phone).toBe('+1 555-0101');
      expect(result.avatar).toBeNull();
    });
  });

  describe('adaptUsersArrayToUserModels', () => {
    it('debe mapear correctamente un array de usuarios', () => {
      const apiUsers = [mockApiUser, mockApiUserWithAvatar];

      const result = adaptUsersArrayToUserModels(apiUsers);

      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe('Juan Pérez');
      expect(result[1].fullName).toBe('María García');
    });

    it('debe retornar array vacío si recibe array vacío', () => {
      const result = adaptUsersArrayToUserModels([]);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe procesar correctamente múltiples usuarios con datos variados', () => {
      const apiUsers = [mockApiUser, mockApiUserWithAvatar];

      const result = adaptUsersArrayToUserModels(apiUsers);

      expect(result[0].phone).toBe('+1 555-0101');
      expect(result[1].phone).toBe('+1 555-0102');
      expect(result[0].avatar).toBeNull();
      expect(result[1].avatar).toBe('https://example.com/avatar.jpg');
    });
  });
});
