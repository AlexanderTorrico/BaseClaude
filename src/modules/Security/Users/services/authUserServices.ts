import { createApiInstance, loadAbort } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';
import { UserResponseModel } from '../models/UserResponseModel';


const api = createApiInstance();

export const loginHttpCall = (): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  const controller = loadAbort();
  
  return {
    call: api.post<ApiResponse<UserResponseModel[]>>('/rrhh/by_company_id/1', {}, {
      signal: controller.signal
    }),
    controller
  };
};

