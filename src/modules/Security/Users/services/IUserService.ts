import { UserModel } from '../models/UserModel';
import { SetStateFn, ServiceResult } from '@/shared/types/commonTypes';

export interface IUserService {
  getUsersByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ServiceResult<UserModel[]>>;
}
