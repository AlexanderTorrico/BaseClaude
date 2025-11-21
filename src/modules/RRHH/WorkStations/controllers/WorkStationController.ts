import { ControllerResponse } from '@/shared/controllers/ControllerResponse';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { RequirementModel } from '../models/RequirementModel';
import * as WorkStationServices from '../services/workStationServices';
import * as WorkStationAdapter from '../adapters/workStationAdapter';
import * as RequirementAdapter from '../adapters/requirementAdapter';
import { store } from '@/store';
import {
  setWorkStations,
  setLoading,
  setError,
  setSelectedWorkStation,
  setRequirements,
  setLoadingRequirements
} from '../slices/workStationsSlice';
import { buildWorkStationTree, hasCircularDependency, validateTreeStructure } from '../utils/treeHelpers';

/**
 * Controlador para WorkStations
 * Orquesta: Service → Adapter → Redux
 * NO usa createAsyncThunk, todo es manual
 */

export class WorkStationController {
  // =========================================================================
  // WORKSTATION CRUD
  // =========================================================================

  /**
   * Obtener todos los WorkStations
   */
  static async getWorkStations(): Promise<ControllerResponse<WorkStationModel[]>> {
    try {
      store.dispatch(setLoading(true));
      store.dispatch(setError(null));

      // 1. Llamar al servicio
      const apiWorkStations = await WorkStationServices.getWorkStations();

      // 2. Adaptar a modelo UI
      const workStations = WorkStationAdapter.adaptWorkStationsArray(apiWorkStations);

      // 3. Validar estructura del árbol
      const validation = validateTreeStructure(workStations);
      if (!validation.valid) {
        console.warn('⚠️ Estructura del árbol tiene problemas:', validation.errors);
      }

      // 4. Actualizar Redux
      store.dispatch(setWorkStations(workStations));
      store.dispatch(setLoading(false));

      return {
        success: true,
        data: workStations,
        message: 'WorkStations obtenidos exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al obtener WorkStations';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));

      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  }

  /**
   * Obtener WorkStation por ID
   */
  static async getWorkStationById(id: number): Promise<ControllerResponse<WorkStationModel | null>> {
    try {
      store.dispatch(setLoading(true));

      const apiWorkStation = await WorkStationServices.getWorkStationById(id);

      if (!apiWorkStation) {
        store.dispatch(setLoading(false));
        return {
          success: false,
          data: null,
          message: `WorkStation con id ${id} no encontrado`
        };
      }

      // Obtener todos para resolver dependencias
      const allApiWorkStations = await WorkStationServices.getWorkStations();
      const workStation = WorkStationAdapter.adaptWorkStationResponseToModel(
        apiWorkStation,
        allApiWorkStations
      );

      store.dispatch(setSelectedWorkStation(workStation));
      store.dispatch(setLoading(false));

      return {
        success: true,
        data: workStation,
        message: 'WorkStation obtenido exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al obtener WorkStation';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));

      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  }

  /**
   * Crear nuevo WorkStation
   */
  static async createWorkStation(
    workStationData: Partial<WorkStationModel>
  ): Promise<ControllerResponse<WorkStationModel>> {
    try {
      store.dispatch(setLoading(true));

      // Validar dependencia circular
      if (workStationData.dependencyId && workStationData.dependencyId !== 0) {
        const allApiWorkStations = await WorkStationServices.getWorkStations();
        const allWorkStations = WorkStationAdapter.adaptWorkStationsArray(allApiWorkStations);

        // Usar un ID temporal negativo para la validación
        const tempId = -1;
        if (hasCircularDependency(tempId, workStationData.dependencyId, allWorkStations)) {
          store.dispatch(setLoading(false));
          return {
            success: false,
            data: null as any,
            message: 'No se puede crear: dependencia circular detectada'
          };
        }
      }

      // Adaptar a formato API
      const apiData = WorkStationAdapter.adaptWorkStationModelToRequest(workStationData);

      // Llamar servicio
      const createdApiWorkStation = await WorkStationServices.createWorkStation(
        apiData as any
      );

      // Adaptar respuesta
      const allApiWorkStations = await WorkStationServices.getWorkStations();
      const createdWorkStation = WorkStationAdapter.adaptWorkStationResponseToModel(
        createdApiWorkStation,
        allApiWorkStations
      );

      // Refrescar lista completa
      await this.getWorkStations();

      store.dispatch(setLoading(false));

      return {
        success: true,
        data: createdWorkStation,
        message: 'WorkStation creado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear WorkStation';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));

      return {
        success: false,
        data: null as any,
        message: errorMessage
      };
    }
  }

  /**
   * Actualizar WorkStation existente
   */
  static async updateWorkStation(
    id: number,
    workStationData: Partial<WorkStationModel>
  ): Promise<ControllerResponse<WorkStationModel>> {
    try {
      store.dispatch(setLoading(true));

      // Validar dependencia circular si se está cambiando el padre
      if (workStationData.dependencyId !== undefined) {
        const allApiWorkStations = await WorkStationServices.getWorkStations();
        const allWorkStations = WorkStationAdapter.adaptWorkStationsArray(allApiWorkStations);

        if (hasCircularDependency(id, workStationData.dependencyId, allWorkStations)) {
          store.dispatch(setLoading(false));
          return {
            success: false,
            data: null as any,
            message: 'No se puede actualizar: dependencia circular detectada'
          };
        }
      }

      // Adaptar a formato API
      const apiData = WorkStationAdapter.adaptWorkStationModelToRequest(workStationData);

      // Llamar servicio
      const updatedApiWorkStation = await WorkStationServices.updateWorkStation(id, apiData);

      // Adaptar respuesta
      const allApiWorkStations = await WorkStationServices.getWorkStations();
      const updatedWorkStation = WorkStationAdapter.adaptWorkStationResponseToModel(
        updatedApiWorkStation,
        allApiWorkStations
      );

      // Refrescar lista completa
      await this.getWorkStations();

      store.dispatch(setLoading(false));

      return {
        success: true,
        data: updatedWorkStation,
        message: 'WorkStation actualizado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar WorkStation';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));

      return {
        success: false,
        data: null as any,
        message: errorMessage
      };
    }
  }

  /**
   * Eliminar WorkStation
   */
  static async deleteWorkStation(id: number): Promise<ControllerResponse<void>> {
    try {
      store.dispatch(setLoading(true));

      await WorkStationServices.deleteWorkStation(id);

      // Refrescar lista completa
      await this.getWorkStations();

      store.dispatch(setLoading(false));

      return {
        success: true,
        data: undefined,
        message: 'WorkStation eliminado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al eliminar WorkStation';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));

      return {
        success: false,
        data: undefined,
        message: errorMessage
      };
    }
  }

  // =========================================================================
  // ÁRBOL JERÁRQUICO
  // =========================================================================

  /**
   * Construir árbol jerárquico
   */
  static async getWorkStationTree(): Promise<ControllerResponse<WorkStationModel[]>> {
    try {
      const response = await this.getWorkStations();

      if (!response.success || !response.data) {
        return response;
      }

      const tree = buildWorkStationTree(response.data);

      return {
        success: true,
        data: tree,
        message: 'Árbol jerárquico construido exitosamente'
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Error al construir árbol jerárquico'
      };
    }
  }

  // =========================================================================
  // REQUIREMENTS
  // =========================================================================

  /**
   * Obtener Requirements de un WorkStation
   */
  static async getRequirementsByWorkStation(
    workStationId: number
  ): Promise<ControllerResponse<RequirementModel[]>> {
    try {
      store.dispatch(setLoadingRequirements(true));

      const apiRequirements = await WorkStationServices.getRequirementsByWorkStation(
        workStationId
      );

      const requirements = RequirementAdapter.adaptRequirementsArray(apiRequirements);

      store.dispatch(setRequirements(requirements));
      store.dispatch(setLoadingRequirements(false));

      return {
        success: true,
        data: requirements,
        message: 'Requirements obtenidos exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al obtener Requirements';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoadingRequirements(false));

      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  }

  /**
   * Crear nuevo Requirement
   */
  static async createRequirement(
    requirementData: Partial<RequirementModel>
  ): Promise<ControllerResponse<RequirementModel>> {
    try {
      store.dispatch(setLoadingRequirements(true));

      const apiData = RequirementAdapter.adaptRequirementModelToRequest(requirementData);

      const createdApiRequirement = await WorkStationServices.createRequirement(
        apiData as any
      );

      const createdRequirement = RequirementAdapter.adaptRequirementResponseToModel(
        createdApiRequirement
      );

      // Refrescar lista si hay workstation seleccionado
      if (requirementData.workStationId) {
        await this.getRequirementsByWorkStation(requirementData.workStationId);
      }

      store.dispatch(setLoadingRequirements(false));

      return {
        success: true,
        data: createdRequirement,
        message: 'Requirement creado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear Requirement';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoadingRequirements(false));

      return {
        success: false,
        data: null as any,
        message: errorMessage
      };
    }
  }

  /**
   * Actualizar Requirement
   */
  static async updateRequirement(
    id: number,
    requirementData: Partial<RequirementModel>
  ): Promise<ControllerResponse<RequirementModel>> {
    try {
      store.dispatch(setLoadingRequirements(true));

      const apiData = RequirementAdapter.adaptRequirementModelToRequest(requirementData);

      const updatedApiRequirement = await WorkStationServices.updateRequirement(id, apiData);

      const updatedRequirement = RequirementAdapter.adaptRequirementResponseToModel(
        updatedApiRequirement
      );

      // Refrescar lista si hay workstation
      if (updatedRequirement.workStationId) {
        await this.getRequirementsByWorkStation(updatedRequirement.workStationId);
      }

      store.dispatch(setLoadingRequirements(false));

      return {
        success: true,
        data: updatedRequirement,
        message: 'Requirement actualizado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar Requirement';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoadingRequirements(false));

      return {
        success: false,
        data: null as any,
        message: errorMessage
      };
    }
  }

  /**
   * Eliminar Requirement
   */
  static async deleteRequirement(
    id: number,
    workStationId: number
  ): Promise<ControllerResponse<void>> {
    try {
      store.dispatch(setLoadingRequirements(true));

      await WorkStationServices.deleteRequirement(id);

      // Refrescar lista
      await this.getRequirementsByWorkStation(workStationId);

      store.dispatch(setLoadingRequirements(false));

      return {
        success: true,
        data: undefined,
        message: 'Requirement eliminado exitosamente'
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al eliminar Requirement';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoadingRequirements(false));

      return {
        success: false,
        data: undefined,
        message: errorMessage
      };
    }
  }
}
