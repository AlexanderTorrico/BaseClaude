import { IWorkStationService } from './IWorkStationService';
import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse, transformApiData } from '@/shared/types';
import { httpRequestWithAuth } from '@/services/httpService';
import { adaptWorkStationsFromApi } from '../adapters/workStationApiAdapter';

export class WorkStationApiService implements IWorkStationService {
  
  async getWorkStationsByCompany( companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<WorkStationModel[]>> {
    const endpoint = `api/rrhh/company/${companyId}/workstation`;
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(endpoint, setLoading);
    return transformApiData(res, (data) => adaptWorkStationsFromApi(data?.data ?? []));
  }
}
