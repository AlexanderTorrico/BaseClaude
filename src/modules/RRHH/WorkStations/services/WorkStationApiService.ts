import { IWorkStationService, AddRequirementDto, AddResponsabilityDto } from './IWorkStationService';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse, transformApiData } from '@/shared/types';
import { httpRequestWithAuth } from '@/services/httpService';
import { adaptWorkStationsFromApi } from '../adapters/workStationApiAdapter';

export class WorkStationApiService implements IWorkStationService {

  async getWorkStationsByCompany(companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<WorkStationModel[]>> {
    const endpoint = `api/rrhh/company/${companyId}/workstation`;
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(endpoint, setLoading);
    return transformApiData(res, (data) => adaptWorkStationsFromApi(data?.data ?? []));
  }

  async addRequirement(dto: AddRequirementDto, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
    const endpoint = 'api/rrhh/workstation/requirement';
    return await httpRequestWithAuth.post<ApiResponse<any>>(endpoint, dto, setLoading);
  }

  async addResponsability(dto: AddResponsabilityDto, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
    const endpoint = 'api/rrhh/workstation/responsability';
    return await httpRequestWithAuth.post<ApiResponse<any>>(endpoint, dto, setLoading);
  }
}
