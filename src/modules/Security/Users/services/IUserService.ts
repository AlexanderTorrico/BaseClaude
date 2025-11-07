import { IBaseService } from '@/shared/services/IBaseService';
import { UserModel } from '../models/UserModel';
import { ISetState, ServiceResult } from '@/shared/types/commonTypes';

export interface IUserService extends IBaseService {
  getUsersByCompany(
    companyId: number,
    setLoading?: ISetState
  ): Promise<ServiceResult<UserModel[]>>;
}
