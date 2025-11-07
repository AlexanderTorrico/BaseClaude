import { UserModel } from '../models/UserModel';
import { ISetState, ServiceResult } from '@/shared/types/commonTypes';

export interface IUserService {
  getUsersByCompany(
    companyId: number,
    setLoading?: ISetState
  ): Promise<ServiceResult<UserModel[]>>;
}
