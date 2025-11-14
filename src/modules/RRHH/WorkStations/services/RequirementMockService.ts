import { IRequirementService } from './IRequirementService';
import { RequirementModel } from '../models/RequirementModel';
import { RequirementResponseModel } from '../models/RequirementResponseModel';
import { mockRequirements } from '../data/mockRequirements';
import { adaptRequirementsArray, adaptRequirementResponseToModel, adaptRequirementModelToRequest } from '../adapters/requirementAdapter';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Implementación Mock del servicio de Requirements
 * Usa datos locales para simular peticiones a la base de datos
 */
export class RequirementMockService implements IRequirementService {
  private mockData: RequirementResponseModel[] = [...mockRequirements];
  private nextId: number = Math.max(...mockRequirements.map(req => req.id)) + 1;

  /**
   * Obtener todos los requirements
   */
  async getRequirements(
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>> {
    setLoading?.(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    // Adaptar datos de snake_case a camelCase
    const adaptedData = adaptRequirementsArray(this.mockData);

    return {
      status: 200,
      message: 'Requirements obtenidos exitosamente',
      data: adaptedData
    };
  }

  /**
   * Obtener requirements por WorkStation ID
   */
  async getRequirementsByWorkStation(
    workStationId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel[]>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    setLoading?.(false);

    // Filtrar por workstation_id
    const filtered = this.mockData.filter(req => req.rhh_workstation_id === workStationId);

    // Adaptar datos
    const adaptedData = adaptRequirementsArray(filtered);

    return {
      status: 200,
      message: `Requirements del puesto ${workStationId} obtenidos exitosamente`,
      data: adaptedData
    };
  }

  /**
   * Obtener un requirement por ID
   */
  async getRequirementById(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    setLoading?.(false);

    const requirement = this.mockData.find(req => req.id === id);

    if (!requirement) {
      return {
        status: 404,
        message: `Requirement con ID ${id} no encontrado`,
        data: {} as RequirementModel
      };
    }

    const adaptedData = adaptRequirementResponseToModel(requirement);

    return {
      status: 200,
      message: 'Requirement encontrado',
      data: adaptedData
    };
  }

  /**
   * Crear un nuevo requirement
   */
  async createRequirement(
    data: Partial<RequirementModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<RequirementModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    setLoading?.(false);

    // Validaciones básicas
    if (!data.description || data.rhhWorkstationId === undefined) {
      return {
        status: 400,
        message: 'Datos incompletos: se requiere description y rhhWorkstationId',
        data: {} as RequirementModel
      };
    }

    // Convertir de camelCase a snake_case
    const apiData = adaptRequirementModelToRequest(data);

    // Crear nuevo registro
    const newRequirement: RequirementResponseModel = {
      id: this.nextId++,
      description: apiData.description!,
      rhh_workstation_id: apiData.rhh_workstation_id!,
      category: apiData.category,
      is_required: apiData.is_required ?? true
    };

    this.mockData.push(newRequirement);

    // Adaptar y retornar
    const adaptedData = adaptRequirementResponseToModel(newRequirement);

    return {
      status: 201,
      message: 'Requirement creado exitosamente',
      data: adaptedData
    };
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

    await new Promise(resolve => setTimeout(resolve, 600));

    setLoading?.(false);

    const index = this.mockData.findIndex(req => req.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: `Requirement con ID ${id} no encontrado`,
        data: {} as RequirementModel
      };
    }

    // Convertir de camelCase a snake_case
    const apiData = adaptRequirementModelToRequest(data);

    // Actualizar datos
    this.mockData[index] = {
      ...this.mockData[index],
      ...(apiData.description && { description: apiData.description }),
      ...(apiData.rhh_workstation_id !== undefined && { rhh_workstation_id: apiData.rhh_workstation_id }),
      ...(apiData.category && { category: apiData.category }),
      ...(apiData.is_required !== undefined && { is_required: apiData.is_required })
    };

    // Adaptar y retornar
    const adaptedData = adaptRequirementResponseToModel(this.mockData[index]);

    return {
      status: 200,
      message: 'Requirement actualizado exitosamente',
      data: adaptedData
    };
  }

  /**
   * Eliminar un requirement
   */
  async deleteRequirement(
    id: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<void>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    const index = this.mockData.findIndex(req => req.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: `Requirement con ID ${id} no encontrado`,
        data: undefined
      };
    }

    // Eliminar
    this.mockData.splice(index, 1);

    return {
      status: 200,
      message: 'Requirement eliminado exitosamente',
      data: undefined
    };
  }
}
