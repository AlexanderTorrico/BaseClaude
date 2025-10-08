import { getUsersByCompanyCall } from '../services/userServices';
import { store } from '@/store';
import { setLoading, setUsers, setError } from '../slices/usersSice';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';
import { ControllerResponse, createSuccessResponse, createErrorResponse } from '@/shared/controllers/ControllerResponse';
import { UserModel } from '../models/UserModel';

export class UserController {
  /**
   * Obtiene usuarios por company_id
   */
  static async getUsersByCompany(companyId: number): Promise<ControllerResponse<UserModel[]>> {
    try {
      store.dispatch(setLoading(true));

      const { call } = getUsersByCompanyCall(companyId);
      const response = await call;
      const mappedUsers = adaptUsersArrayToUserModels(response.data.data ?? []);

      store.dispatch(setUsers(mappedUsers));

      return createSuccessResponse(mappedUsers);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      store.dispatch(setError(errorMessage));

      if (error?.response?.status === 401) {
        console.warn('⚠️ Token inválido o expirado');
      }

      return createErrorResponse(errorMessage);
    }
  }
}

export const getUsersByCompany = UserController.getUsersByCompany;
