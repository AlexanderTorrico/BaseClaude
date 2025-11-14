import { RequirementModel } from '../models/RequirementModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interface para el servicio de Requirements
 * Define el contrato que deben cumplir las implementaciones Mock y API
 */
export interface IRequirementService {
  /**
   * Obtener todos los requirements
   */
  getRequirements(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>>;

  /**
   * Obtener requirements por WorkStation ID
   */
  getRequirementsByWorkStation(
    workStationId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>>;

  /**
   * Obtener un requirement por ID
   */
  getRequirementById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>>;

  /**
   * Crear un nuevo requirement
   */
  createRequirement(
    data: Partial<RequirementModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>>;

  /**
   * Actualizar un requirement existente
   */
  updateRequirement(
    id: number,
    data: Partial<RequirementModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>>;

  /**
   * Eliminar un requirement
   */
  deleteRequirement(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<void>>;
}
