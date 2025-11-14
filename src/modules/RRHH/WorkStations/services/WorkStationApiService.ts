import { IWorkStationService } from './IWorkStationService';
import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Implementación API del servicio de WorkStations
 * Conecta con el backend real mediante HTTP requests
 *
 * TODO: Implementar cuando el backend esté disponible
 */
export class WorkStationApiService implements IWorkStationService {
  private readonly baseUrl = '/api/workstations';

  /**
   * Obtener todos los puestos de trabajo
   */
  async getWorkStations(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>> {
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
        message: `Error al obtener puestos de trabajo: ${error}`,
        data: []
      };
    }
  }

  /**
   * Obtener un puesto de trabajo por ID
   */
  async getWorkStationById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>> {
    setLoading?.(true);

    try {
      // TODO: Implementar petición HTTP real
      // const response = await fetch(`${this.baseUrl}/${id}`);
      // const data = await response.json();

      setLoading?.(false);

      return {
        status: 501,
        message: 'API Service no implementado - usar MockService',
        data: {} as WorkStationModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al obtener puesto de trabajo: ${error}`,
        data: {} as WorkStationModel
      };
    }
  }

  /**
   * Crear un nuevo puesto de trabajo
   */
  async createWorkStation(
    data: Partial<WorkStationModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>> {
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
        data: {} as WorkStationModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al crear puesto de trabajo: ${error}`,
        data: {} as WorkStationModel
      };
    }
  }

  /**
   * Actualizar un puesto de trabajo existente
   */
  async updateWorkStation(
    id: number,
    data: Partial<WorkStationModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>> {
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
        data: {} as WorkStationModel
      };
    } catch (error) {
      setLoading?.(false);

      return {
        status: 500,
        message: `Error al actualizar puesto de trabajo: ${error}`,
        data: {} as WorkStationModel
      };
    }
  }

  /**
   * Eliminar un puesto de trabajo
   */
  async deleteWorkStation(
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
        message: `Error al eliminar puesto de trabajo: ${error}`,
        data: undefined
      };
    }
  }
}
