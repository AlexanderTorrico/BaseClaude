import {
  getUsersCall,
  getUserByIdCall,
  createUserCall,
  updateUserCall,
  deleteUserCall,
  getUsersByCompanyCall,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters
} from '../services/userServices';
import { userCall } from '@/services/httpService';
import { UserResponseModel } from '../models/UserResponseModel';
import { ApiResponse } from '@/pages/Authentication/models';

// Helper para redirect al login
const redirectToLogin = () => {
  // Limpiar el token del localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('lastLogin');

  // Redirect al login
  window.location.href = '/authentication/login';
};

export class UserController {

  /**
   * Obtiene la lista de usuarios con filtros opcionales
   * @param filters - Filtros opcionales para la búsqueda
   * @returns Promise con la respuesta de la API
   */
  static async getUsers(filters?: UserFilters): Promise<ApiResponse<UserResponseModel[]>> {
    try {
      const { call } = getUsersCall(filters);
      const response = await call;
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios por company_id (tu endpoint actual)
   * @param companyId - ID de la compañía
   * @returns Promise con la respuesta de la API
   */
  static async getUsersByCompany(companyId: number): Promise<ApiResponse<UserResponseModel[]>> {
    try {
      const { call } = getUsersByCompanyCall(companyId);
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios por compañía:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Método legacy - usa tu endpoint actual /rrhh/by_company_id/1
   * @returns Promise con la respuesta de la API
   */
  static async getUsersLegacy(): Promise<ApiResponse<UserResponseModel[]>> {
    try {
      const { call } = userCall();
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios (método legacy):', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param userId - ID del usuario
   * @returns Promise con la respuesta de la API
   */
  static async getUserById(userId: string): Promise<ApiResponse<UserResponseModel>> {
    try {
      const { call } = getUserByIdCall(userId);
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuario por ID:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param userData - Datos del usuario a crear
   * @returns Promise con la respuesta de la API
   */
  static async createUser(userData: CreateUserRequest): Promise<ApiResponse<UserResponseModel>> {
    try {
      const { call } = createUserCall(userData);
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos a actualizar
   * @returns Promise con la respuesta de la API
   */
  static async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UserResponseModel>> {
    try {
      const { call } = updateUserCall(userId, userData);
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param userId - ID del usuario a eliminar
   * @returns Promise con la respuesta de la API
   */
  static async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { call } = deleteUserCall(userId);
      const response = await call;
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      UserController.handleApiError(error);
      throw error;
    }
  }

  /**
   * Maneja errores comunes de la API
   * @param error - Error capturado
   */
  private static handleApiError(error: any): void {
    // Si el status code es 401 o 405, el token es inválido
    if (error?.response?.status === 401 || error?.response?.status === 405) {
      console.warn('Token inválido o expirado. Redirigiendo al login...');
      // Descomenta para habilitar redirect automático
      // redirectToLogin();
    }
  }
}

// Exportar las funciones directamente para facilitar la importación
export const getUsers = UserController.getUsers;
export const getUsersByCompany = UserController.getUsersByCompany;
export const getUsersLegacy = UserController.getUsersLegacy;
export const getUserById = UserController.getUserById;
export const createUser = UserController.createUser;
export const updateUser = UserController.updateUser;
export const deleteUser = UserController.deleteUser;