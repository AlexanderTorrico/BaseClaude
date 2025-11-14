import { UserModel } from '../../models/UserModel';
import { WorkStationModel } from '../../models/WorkStationModel';

// ==================== LISTA DE WORKSTATIONS ====================
const WS_DEVELOPER: WorkStationModel = { id: 1, name: 'Developer', level: 2, dependencyId: 5 };
const WS_DESIGNER: WorkStationModel = { id: 2, name: 'Designer', level: 3, dependencyId: 6 };
const WS_TEST: WorkStationModel = { id: 3, name: 'Test', level: 1, dependencyId: 1 };

// ==================== LISTA DE USUARIOS (UI Models) ====================
export const MOCK_USERS: UserModel[] = [
  {
    id: 1,
    fullName: 'Juan Pérez',
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '+1 555-0101',
    avatar: null,
    workStation: WS_DEVELOPER,
    roleIds: [],
    roles: [],
    permissionIds: [],
    permissions: [],
  },
  {
    id: 2,
    fullName: 'María García',
    name: 'María',
    lastName: 'García',
    email: 'maria@example.com',
    phone: '+1 555-0102',
    avatar: 'https://example.com/avatar.jpg',
    workStation: WS_DESIGNER,
    roleIds: [],
    roles: [],
    permissionIds: [],
    permissions: [],
  },
  {
    id: 3,
    fullName: '',
    name: '',
    lastName: '',
    email: 'empty@example.com',
    phone: null,
    avatar: null,
    workStation: WS_TEST,
    roleIds: [],
    roles: [],
    permissionIds: [],
    permissions: [],
  },
];

// ==================== EXPORTACIONES INDIVIDUALES ====================
// Usamos non-null assertions (!) porque sabemos que estos índices existen
export const mockUsers = [MOCK_USERS[0]!, MOCK_USERS[1]!]; // Alias para tests
export const mockUserModel = MOCK_USERS[0]!;
export const mockUserWithAvatar = MOCK_USERS[1]!;
export const mockUserEmptyNames = MOCK_USERS[2]!;
export const mockUsersArray = [MOCK_USERS[0]!, MOCK_USERS[1]!];

// ==================== LISTA DE USUARIOS API (formato backend) ====================
// Se genera automáticamente desde MOCK_USERS para evitar duplicación
const toApiFormat = (user: UserModel) => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  workStation: { ...user.workStation, dependency_id: user.workStation.dependencyId },
});

const MOCK_API_USERS = MOCK_USERS.map(toApiFormat);

export const mockApiUser = MOCK_API_USERS[0]!;
export const mockApiUserWithAvatar = MOCK_API_USERS[1]!;
export const mockApiUserEmptyNames = MOCK_API_USERS[2]!;
export const mockApiUsersArray = [MOCK_API_USERS[0]!, MOCK_API_USERS[1]!];

// ==================== RESPUESTAS API ====================
export const mockApiSuccessResponse = { data: { success: true, data: mockApiUsersArray } };
export const mockApiEmptyResponse = { data: { success: true, data: [] } };
export const mockApiNullDataResponse = { data: { success: true, data: null } };

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
  id: 1,
  fullName: 'Juan Pérez',
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan@example.com',
  phone: '+1 555-0101',
  avatar: null,
  workStation: WS_DEVELOPER,
  ...overrides,
});

/**
 * Crea un usuario del API con datos personalizados
 */
export const createMockApiUser = (overrides: Partial<ReturnType<typeof toApiFormat>> = {}) => ({
  id: 1,
  name: 'Juan',
  lastName: 'Pérez',
  email: 'juan@example.com',
  phone: '+1 555-0101',
  avatar: null,
  workStation: { ...WS_DEVELOPER, dependency_id: 5 },
  ...overrides,
});

/**
 * Crea múltiples usuarios mock
 */
export const createMockUsersArray = (count: number): UserModel[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: i + 1,
      email: `user${i + 1}@example.com`,
      name: `User${i + 1}`,
      fullName: `User${i + 1} Test`,
    })
  );
};