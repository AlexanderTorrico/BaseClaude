import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { getUsersByCompanyCall } from './userApiCalls';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';

/**
 * Implementación del servicio de usuarios usando API real
 */
export class UserApiService implements IUserService {
  private _loading = false;

  /**
   * Obtiene usuarios desde la API
   */
  async getUsersByCompany(companyId: number): Promise<{ data: UserModel[], loading: boolean }> {
    this._loading = true;

    try {
      const { call } = getUsersByCompanyCall(companyId);
      const response = await call;
      const users = adaptUsersArrayToUserModels(response.data.data ?? []);

      this._loading = false;
      return { data: users, loading: false };

    } catch (error: any) {
      this._loading = false;

      const errorMessage = error?.response?.data?.message || error?.message || 'Error al obtener usuarios';
      throw new Error(errorMessage);
    }
  }
}
