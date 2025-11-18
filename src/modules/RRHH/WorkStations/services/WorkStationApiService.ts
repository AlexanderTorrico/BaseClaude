import { IWorkStationService } from './IWorkStationService';
import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse, transformApiData } from '@/shared/types';
import { httpRequestWithAuth } from '@/services/httpService';
import { adaptWorkStationsFromApi } from '../adapters/workStationApiAdapter';

/**
 * Implementación API del servicio de WorkStations
 * Conecta con el backend real mediante HTTP requests
 */
export class WorkStationApiService implements IWorkStationService {
  /**
   * Obtener puestos de trabajo por compañía
   * Endpoint: api/rrhh/company/{companyId}/workstation
   */
  async getWorkStationsByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>> {
    const endpoint = `api/rrhh/company/${companyId}/workstation`;
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(endpoint, setLoading);
    return transformApiData(res, (data) => adaptWorkStationsFromApi(data?.data ?? []));
  }
}
