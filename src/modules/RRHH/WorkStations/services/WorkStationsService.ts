import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Servicio de WorkStations
 */
export const getWorkStationsCall = (): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    '/workstations'
  );
};
