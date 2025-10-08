import { getUsersByCompanyCall } from '../services/userServices';
import { store } from '@/store';
import { setLoading, setUsers, setError } from '../slices/usersSice';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';
import { ControllerResponse, createSuccessResponse, createErrorResponse } from '../models/ControllerResponse';
import { UserModel } from '../models/UserModel';

export class UserController {

  /**
   * Obtiene usuarios por company_id
   * @param companyId - ID de la compañía
   * @returns ControllerResponse con UserModel[]
   */
  static async getUsersByCompany(companyId: number): Promise<ControllerResponse<UserModel[]>> {
    try {
      store.dispatch(setLoading(true));

      const { call } = getUsersByCompanyCall(companyId);
      const response = await call;

      // Mapeo (manejo de undefined)
      const mappedUsers = adaptUsersArrayToUserModels(response.data.data ?? []);
      console.log('✅ Usuarios mapeados:', mappedUsers);

      // Guardar en Redux
      store.dispatch(setUsers(mappedUsers));

      return createSuccessResponse(mappedUsers);
    } catch (error: any) {
      const errorMessage = UserController.extractErrorMessage(error);
      store.dispatch(setError(errorMessage));
      UserController.handleApiError(error);
      return createErrorResponse(errorMessage);
    }
  }

  /**
   * Extrae el mensaje de error de diferentes tipos de respuestas
   * @param error - Error capturado
   * @returns Mensaje de error formateado
   */
  private static extractErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Ha ocurrido un error desconocido';
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

    console.error('Error en UserController:', error);
  }
}

// Exportar las funciones directamente para facilitar la importación
export const getUsersByCompany = UserController.getUsersByCompany;
