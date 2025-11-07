import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';
import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse } from '@/pages/Authentication/models';
import { wrapperData } from '@/shared/services/ServiceResponse';
import { ISetState, ServiceResult } from '@/shared/types/commonTypes';

export class UserApiService implements IUserService {

  async getUsersByCompany( companyId: number, setLoading?: ISetState ): Promise<ServiceResult<UserModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(`/rrhh/by_company_id/${companyId}`, setLoading);
    return wrapperData(res, (data) => adaptUsersArrayToUserModels(data.data ?? []));
  }
}
