import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { MOCK_USERS_WITH_ROLES } from '../data/mockUsersWithRoles';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ServiceResponse } from '@/shared/services/ServiceResponse';

export class UserMockService implements IUserService {
  private mockUsers: UserModel[] = [...MOCK_USERS_WITH_ROLES];

  async getUsersByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ServiceResponse<UserModel[]>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    return {
      data: [...this.mockUsers],
      status: 200,
      message: 'Success',
    };
  }
}
