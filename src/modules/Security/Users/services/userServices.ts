import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';
import { UserResponseModel } from '../models/UserResponseModel';

/**
 * Obtener usuarios por company_id (autenticado)
 */
export const getUsersByCompanyCall = (companyId: number): AxiosCallModel<ApiResponse<UserResponseModel[]>> => {
  return createAuthenticatedCall<ApiResponse<UserResponseModel[]>>(
    'GET',
    `/rrhh/by_company_id/${companyId}`
  );
};
