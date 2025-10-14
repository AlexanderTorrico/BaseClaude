import { UserModel } from '../../models/UserModel';

/**
 * Fixtures centralizados para tests del módulo Users
 *
 * Contiene datos mock para:
 * - UserModel (modelo de UI después del adapter)
 * - UserApiResponse (respuesta cruda del API)
 * - WorkStation (estación de trabajo)
 */

// ==================== MODELOS DE UI (UserModel) ====================

/**
 * Usuario básico para tests unitarios
 */
export const mockUserModel: UserModel = {
  id: 1,
  fullName: 'Juan Pérez',
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan@example.com',
  phone: '+1 555-0101',
  avatar: null,
  workStation: {
    id: 1,
    name: 'Developer',
    level: 2,
    dependencyId: 5,
  },
};

/**
 * Usuario con avatar
 */
export const mockUserWithAvatar: UserModel = {
  id: 2,
  fullName: 'María García',
  name: 'María',
  lastName: 'García',
  email: 'maria@example.com',
  phone: '+1 555-0102',
  avatar: 'https://example.com/avatar.jpg',
  workStation: {
    id: 2,
    name: 'Designer',
    level: 3,
    dependencyId: 6,
  },
};

/**
 * Usuario con nombres vacíos
 */
export const mockUserEmptyNames: UserModel = {
  id: 3,
  fullName: '',
  name: '',
  lastName: '',
  email: 'empty@example.com',
  phone: null,
  avatar: null,
  workStation: {
    id: 1,
    name: 'Test',
    level: 1,
    dependencyId: 1,
  },
};

/**
 * Array de usuarios para tests de integración
 */
export const mockUsersArray: UserModel[] = [
  mockUserModel,
  mockUserWithAvatar,
];

// ==================== RESPUESTAS DEL API (formato crudo) ====================

/**
 * Usuario del API (formato snake_case como viene del backend)
 */
export const mockApiUser = {
  id: 1,
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan@example.com',
  phone: '+1 555-0101',
  avatar: null,
  workStation: {
    id: 1,
    name: 'Developer',
    level: 2,
    dependency_id: 5, // snake_case
  },
};

/**
 * Usuario del API con avatar
 */
export const mockApiUserWithAvatar = {
  id: 2,
  name: 'María',
  lastName: 'García',
  email: 'maria@example.com',
  phone: '+1 555-0102',
  avatar: 'https://example.com/avatar.jpg',
  workStation: {
    id: 2,
    name: 'Designer',
    level: 3,
    dependency_id: 6,
  },
};

/**
 * Usuario del API con nombres vacíos
 */
export const mockApiUserEmptyNames = {
  id: 3,
  name: '',
  lastName: '',
  email: 'empty@example.com',
  phone: null,
  avatar: null,
  workStation: {
    id: 1,
    name: 'Test',
    level: 1,
    dependency_id: 1,
  },
};

/**
 * Array de usuarios del API
 */
export const mockApiUsersArray = [mockApiUser, mockApiUserWithAvatar];

/**
 * Respuesta exitosa del API
 */
export const mockApiSuccessResponse = {
  data: {
    success: true,
    data: mockApiUsersArray,
  },
};

/**
 * Respuesta del API vacía
 */
export const mockApiEmptyResponse = {
  data: {
    success: true,
    data: [],
  },
};

/**
 * Respuesta del API con datos null
 */
export const mockApiNullDataResponse = {
  data: {
    success: true,
    data: null,
  },
};

// ==================== ERRORES ====================

/**
 * Error de red genérico
 */
export const mockNetworkError = new Error('Network error');

/**
 * Error 401 - No autorizado
 */
export const mockAuthError = {
  response: {
    status: 401,
    data: {
      message: 'Token inválido o expirado',
    },
  },
};

/**
 * Error 500 - Error del servidor
 */
export const mockServerError = {
  response: {
    status: 500,
    data: {
      message: 'Internal server error',
    },
  },
};

// ==================== ESTADO DE REDUX ====================

/**
 * Estado inicial de Redux
 */
export const mockInitialReduxState = {
  list: [],
  loading: false,
  error: null,
};

/**
 * Estado de Redux con usuarios
 */
export const mockReduxStateWithUsers = {
  list: mockUsersArray,
  loading: false,
  error: null,
};

/**
 * Estado de Redux en loading
 */
export const mockReduxStateLoading = {
  list: [],
  loading: true,
  error: null,
};

/**
 * Estado de Redux con error
 */
export const mockReduxStateWithError = {
  list: [],
  loading: false,
  error: 'Error al cargar usuarios',
};

// ==================== FUNCIONES HELPER ====================

/**
 * Crea un usuario con datos personalizados
 */
export const createMockUser = (overrides: Partial<UserModel> = {}): UserModel => ({
  ...mockUserModel,
  ...overrides,
});

/**
 * Crea un usuario del API con datos personalizados
 */
export const createMockApiUser = (overrides: Partial<typeof mockApiUser> = {}) => ({
  ...mockApiUser,
  ...overrides,
});

/**
 * Crea múltiples usuarios mock
 */
export const createMockUsersArray = (count: number): UserModel[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockUserModel,
    id: i + 1,
    email: `user${i + 1}@example.com`,
    name: `User${i + 1}`,
    fullName: `User${i + 1} Test`,
  }));
};