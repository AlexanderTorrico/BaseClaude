import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interface para el servicio de WorkStations
 * Define los métodos que debe implementar cualquier servicio (Mock o API)
 */
export interface IWorkStationService {
  /**
   * Obtener todos los puestos de trabajo
   */
  getWorkStations(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>>;

  /**
   * Obtener un puesto de trabajo por ID
   */
  getWorkStationById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>>;

  /**
   * Crear un nuevo puesto de trabajo
   */
  createWorkStation(
    data: Partial<WorkStationModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>>;

  /**
   * Actualizar un puesto de trabajo existente
   */
  updateWorkStation(
    id: number,
    data: Partial<WorkStationModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>>;

  /**
   * Eliminar un puesto de trabajo
   */
  deleteWorkStation(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<void>>;
}
