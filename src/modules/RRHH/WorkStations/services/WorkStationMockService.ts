import { IWorkStationService } from './IWorkStationService';
import { WorkStationModel } from '../models/WorkStationModel';
import { WorkStationResponseModel } from '../models/WorkStationResponseModel';
import { mockWorkStations } from '../data/mockWorkStations';
import { adaptWorkStationsArray, adaptWorkStationResponseToModel, adaptWorkStationModelToRequest } from '../adapters/workStationAdapter';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Implementación Mock del servicio de WorkStations
 * Usa datos locales para simular peticiones a la base de datos
 */
export class WorkStationMockService implements IWorkStationService {
  private mockData: WorkStationResponseModel[] = [...mockWorkStations];
  private nextId: number = Math.max(...mockWorkStations.map(ws => ws.id)) + 1;

  /**
   * Obtener todos los puestos de trabajo
   */
  async getWorkStations(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel[]>> {
    setLoading?.(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    // Adaptar datos de snake_case a camelCase
    const adaptedData = adaptWorkStationsArray(this.mockData);

    return {
      status: 200,
      message: 'Puestos de trabajo obtenidos exitosamente',
      data: adaptedData
    };
  }

  /**
   * Obtener un puesto de trabajo por ID
   */
  async getWorkStationById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    setLoading?.(false);

    const workStation = this.mockData.find(ws => ws.id === id);

    if (!workStation) {
      return {
        status: 404,
        message: `Puesto de trabajo con ID ${id} no encontrado`,
        data: {} as WorkStationModel
      };
    }

    const adaptedData = adaptWorkStationResponseToModel(workStation, this.mockData);

    return {
      status: 200,
      message: 'Puesto de trabajo encontrado',
      data: adaptedData
    };
  }

  /**
   * Crear un nuevo puesto de trabajo
   */
  async createWorkStation(
    data: Partial<WorkStationModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<WorkStationModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    setLoading?.(false);

    // Validaciones básicas
    if (!data.name || data.level === undefined || data.dependencyId === undefined) {
      return {
        status: 400,
        message: 'Datos incompletos: se requiere name, level y dependencyId',
        data: {} as WorkStationModel
      };
    }

    // Convertir de camelCase a snake_case
    const apiData = adaptWorkStationModelToRequest(data);

    // Crear nuevo registro
    const newWorkStation: WorkStationResponseModel = {
      id: this.nextId++,
      name: apiData.name!,
      level: apiData.level!,
      dependency_id: apiData.dependency_id!
    };

    this.mockData.push(newWorkStation);

    // Adaptar y retornar
    const adaptedData = adaptWorkStationResponseToModel(newWorkStation, this.mockData);

    return {
      status: 201,
      message: 'Puesto de trabajo creado exitosamente',
      data: adaptedData
    };
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

    await new Promise(resolve => setTimeout(resolve, 600));

    setLoading?.(false);

    const index = this.mockData.findIndex(ws => ws.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: `Puesto de trabajo con ID ${id} no encontrado`,
        data: {} as WorkStationModel
      };
    }

    // Convertir de camelCase a snake_case
    const apiData = adaptWorkStationModelToRequest(data);

    // Actualizar datos
    this.mockData[index] = {
      ...this.mockData[index],
      ...(apiData.name && { name: apiData.name }),
      ...(apiData.level !== undefined && { level: apiData.level }),
      ...(apiData.dependency_id !== undefined && { dependency_id: apiData.dependency_id })
    };

    // Adaptar y retornar
    const adaptedData = adaptWorkStationResponseToModel(this.mockData[index], this.mockData);

    return {
      status: 200,
      message: 'Puesto de trabajo actualizado exitosamente',
      data: adaptedData
    };
  }

  /**
   * Eliminar un puesto de trabajo
   */
  async deleteWorkStation(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<void>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    const index = this.mockData.findIndex(ws => ws.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: `Puesto de trabajo con ID ${id} no encontrado`,
        data: undefined
      };
    }

    // Verificar si tiene dependientes
    const hasChildren = this.mockData.some(ws => ws.dependency_id === id);

    if (hasChildren) {
      return {
        status: 400,
        message: 'No se puede eliminar un puesto de trabajo con puestos dependientes',
        data: undefined
      };
    }

    // Eliminar
    this.mockData.splice(index, 1);

    return {
      status: 200,
      message: 'Puesto de trabajo eliminado exitosamente',
      data: undefined
    };
  }
}
