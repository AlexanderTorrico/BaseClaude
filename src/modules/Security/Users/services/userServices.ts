import { createAuthenticatedCall, createPublicCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';
import { UserResponseModel } from '../models/UserResponseModel';

// ==========================================
// TIPOS DE DATOS
// ==========================================

export interface CreateUserRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  privilege: string;
  phone?: string;
  language?: string;
  companyId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  email?: string;
  privilege?: string;
  phone?: string;
  language?: string;
  status?: 'active' | 'inactive';
}

export interface UserFilters {
  name?: string;
  email?: string;
  privilege?: string;
  status?: 'active' | 'inactive';
  companyId?: number;
  page?: number;
  limit?: number;
}

// ==========================================
// SERVICIOS AUTENTICADOS (CON CREDENCIALES)
// ==========================================

/**
 * Obtener lista de usuarios (autenticado)
 */
export const getUsersCall = (filters?: UserFilters): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `/users?${queryString}` : '/users';

  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'GET',
    url
  );
};

/**
 * Obtener usuarios por company_id (autenticado)
 */
export const getUsersByCompanyCall = (companyId: number): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'POST',
    `/rrhh/by_company_id/${companyId}`,
    {}
  );
};

/**
 * Obtener un usuario por ID (autenticado)
 */
export const getUserByIdCall = (userId: string): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'GET',
    `/users/${userId}`
  );
};

/**
 * Crear nuevo usuario (autenticado)
 */
export const createUserCall = (userData: CreateUserRequest): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'POST',
    '/users',
    userData
  );
};

/**
 * Actualizar usuario (autenticado)
 */
export const updateUserCall = (userId: string, userData: UpdateUserRequest): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'PUT',
    `/users/${userId}`,
    userData
  );
};

/**
 * Eliminar usuario (autenticado)
 */
export const deleteUserCall = (userId: string): AxiosCallModel<ApiResponse<{ message: string }>> => {
  return createAuthenticatedCall<ApiResponse<{ message: string }>>(
    'DELETE',
    `/users/${userId}`
  );
};

/**
 * Cambiar estado de usuario (autenticado)
 */
export const toggleUserStatusCall = (userId: string): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'PATCH',
    `/users/${userId}/toggle-status`
  );
};

/**
 * Asignar roles a usuario (autenticado)
 */
export const assignRolesToUserCall = (userId: string, roleIds: number[]): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'POST',
    `/users/${userId}/roles`,
    { roleIds }
  );
};

/**
 * Asignar permisos a usuario (autenticado)
 */
export const assignPermissionsToUserCall = (userId: string, permissionIds: number[]): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel>>(
    'POST',
    `/users/${userId}/permissions`,
    { permissionIds }
  );
};

// ==========================================
// SERVICIOS PÚBLICOS (SIN CREDENCIALES)
// ==========================================

/**
 * Obtener lista pública de usuarios (sin autenticación)
 * Útil para directorios públicos o listas de contacto
 */
export const getPublicUsersCall = (filters?: Partial<UserFilters>): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `/public/users?${queryString}` : '/public/users';

  return createPublicCall<ApiResponse<UserResponseModel[]>>(
    'GET',
    url
  );
};

/**
 * Obtener perfil público de usuario (sin autenticación)
 */
export const getPublicUserProfileCall = (userId: string): AxiosCallModel<ApiResponse<Partial<UserResponseModel>>> => {
  return createPublicCall<ApiResponse<Partial<UserResponseModel>>>(
    'GET',
    `/public/users/${userId}/profile`
  );
};

/**
 * Verificar disponibilidad de email (sin autenticación)
 */
export const checkEmailAvailabilityCall = (email: string): AxiosCallModel<ApiResponse<{ available: boolean }>> => {
  return createPublicCall<ApiResponse<{ available: boolean }>>(
    'POST',
    '/public/users/check-email',
    { email }
  );
};

/**
 * Registro público de usuario (sin autenticación)
 */
export const registerPublicUserCall = (userData: Omit<CreateUserRequest, 'privilege'>): AxiosCallModel<ApiResponse<UserResponseModel>> => {
  return createPublicCall<ApiResponse<UserResponseModel>>(
    'POST',
    '/public/users/register',
    userData
  );
};

/**
 * Recuperación de contraseña (sin autenticación)
 */
export const forgotPasswordCall = (email: string): AxiosCallModel<ApiResponse<{ message: string }>> => {
  return createPublicCall<ApiResponse<{ message: string }>>(
    'POST',
    '/public/users/forgot-password',
    { email }
  );
};

/**
 * Restablecer contraseña (sin autenticación)
 */
export const resetPasswordCall = (token: string, newPassword: string): AxiosCallModel<ApiResponse<{ message: string }>> => {
  return createPublicCall<ApiResponse<{ message: string }>>(
    'POST',
    '/public/users/reset-password',
    { token, password: newPassword }
  );
};

// ==========================================
// SERVICIOS DE UTILIDAD
// ==========================================

/**
 * Obtener estadísticas de usuarios (autenticado)
 */
export const getUserStatsCall = (): AxiosCallModel<ApiResponse<{
  total: number;
  active: number;
  inactive: number;
  byPrivilege: Record<string, number>;
  byLanguage: Record<string, number>;
}>> => {
  return createAuthenticatedCall(
    'GET',
    '/users/stats'
  );
};

/**
 * Exportar usuarios a Excel (autenticado)
 */
export const exportUsersCall = (filters?: UserFilters): AxiosCallModel<Blob> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `/users/export?${queryString}` : '/users/export';

  return createAuthenticatedCall<Blob>(
    'GET',
    url,
    undefined,
    { responseType: 'blob' }
  );
};

