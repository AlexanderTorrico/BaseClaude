import { IRequirementService } from './IRequirementService';
import { RequirementModel } from '../models/RequirementModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Implementación API del servicio de Requirements
 * Conecta con el backend real mediante HTTP requests
 *
 * TODO: Implementar cuando el backend esté disponible
 */
export class RequirementApiService implements IRequirementService {
  private readonly baseUrl = '/api/requirements';

  /**
   * Obtener todos los requirements
   */
  async getRequirements(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(this.baseUrl);
      // const data = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: []
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al obtener requirements: ${error}`,
        data: []
      };
    }
  }

  /**
   * Obtener requirements por WorkStation ID
   */
  async getRequirementsByWorkStation(
    workStationId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(`${this.baseUrl}?workstation_id=${workStationId}`);
      // const data = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: []
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al obtener requirements: ${error}`,
        data: []
      };
    }
  }

  /**
   * Obtener un requirement por ID
   */
  async getRequirementById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(`${this.baseUrl}/${id}`);
      // const data = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: {} as RequirementModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al obtener requirement: ${error}`,
        data: {} as RequirementModel
      };
    }
  }

  /**
   * Crear un nuevo requirement
   */
  async createRequirement(
    data: Partial<RequirementModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(this.baseUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const responseData = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: {} as RequirementModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al crear requirement: ${error}`,
        data: {} as RequirementModel
      };
    }
  }

  /**
   * Actualizar un requirement existente
   */
  async updateRequirement(
    id: number,
    data: Partial<RequirementModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(`${this.baseUrl}/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const responseData = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: {} as RequirementModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al actualizar requirement: ${error}`,
        data: {} as RequirementModel
      };
    }
  }

  /**
   * Eliminar un requirement
   */
  async deleteRequirement(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<void>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(`${this.baseUrl}/${id}`, {
      //   method: 'DELETE'
      // });

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: undefined
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al eliminar requirement: ${error}`,
        data: undefined
      };
    }
  }
}
