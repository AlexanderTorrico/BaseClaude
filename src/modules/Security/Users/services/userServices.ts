import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Obtener usuarios por company_id (autenticado)
 */
export const getUsersByCompanyCall = (companyId: number): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    `/rrhh/by_company_id/${companyId}`
  );
};
