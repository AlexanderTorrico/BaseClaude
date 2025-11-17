import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';
import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

export class UserApiService implements IUserService {

  async getUsersByCompany( companyId: number, setLoading?: SetStateFn ): Promise<ApiResponse<UserModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(`/api/rrhh/by_company_id/${companyId}`, setLoading);
    return transformApiData(res, (data) => adaptUsersArrayToUserModels(data.data ?? []) );
  }
}
