import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { MOCK_USERS_WITH_ROLES } from '../data/mockUsersWithRoles';

/**
 * Implementación del servicio de usuarios usando datos mock
 */
export class UserMockService implements IUserService {
  private _loading = false;
  private mockUsers: UserModel[] = [...MOCK_USERS_WITH_ROLES];

  /**
   * Obtiene usuarios desde mock data
   */
  async getUsersByCompany(companyId: number): Promise<{ data: UserModel[], loading: boolean }> {
    this._loading = true;

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    this._loading = false;
    return { data: [...this.mockUsers], loading: false };
  }
}
