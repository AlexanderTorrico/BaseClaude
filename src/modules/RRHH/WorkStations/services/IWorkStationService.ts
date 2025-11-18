import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interface para el servicio de WorkStations
 * Define los métodos que debe implementar cualquier servicio (Mock o API)
 */
export interface IWorkStationService {
  /**
   * Obtener puestos de trabajo por compañía
   */
  getWorkStationsByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>>;
}
