import { useState } from 'react';
import { store } from '@/store';
import { IRequirementService } from '../services/IRequirementService';
import { setRequirements, addRequirement, updateRequirement as updateRequirementAction, removeRequirement } from '../slices/workStationsSlice';
import { RequirementModel } from '../models/RequirementModel';

/**
 * Hook asíncrono para Requirements
 * Maneja las peticiones al servicio (Mock o API) y actualiza Redux
 * Recibe una implementación de IRequirementService por inyección de dependencias
 */
export const useRequirementsFetch = (service: IRequirementService) => {
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los requirements
   */
  const fetchRequirements = async (): Promise<void> => {
    const result = await service.getRequirements(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching requirements: [${result.status}] ${result.message}`);
      return;
    }

    store.dispatch(setRequirements(result.data));
  };

  /**
   * Obtener requirements por WorkStation ID
   */
  const fetchRequirementsByWorkStation = async (workStationId: number): Promise<void> => {
    const result = await service.getRequirementsByWorkStation(workStationId, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching requirements: [${result.status}] ${result.message}`);
      return;
    }

    store.dispatch(setRequirements(result.data));
  };

  /**
   * Obtener un requirement por ID
   */
  const fetchRequirementById = async (id: number): Promise<RequirementModel | null> => {
    const result = await service.getRequirementById(id, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching requirement: [${result.status}] ${result.message}`);
      return null;
    }

    return result.data;
  };

  /**
   * Crear un nuevo requirement
   */
  const createRequirement = async (data: Partial<RequirementModel>): Promise<boolean> => {
    const result = await service.createRequirement(data, setLoading);

    if (result.status !== 201) {
      console.error(`❌ Error creating requirement: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(addRequirement(result.data));
    console.log('✅ Requirement creado:', result.data.description);
    return true;
  };

  /**
   * Actualizar un requirement existente
   */
  const updateRequirement = async (id: number, data: Partial<RequirementModel>): Promise<boolean> => {
    const result = await service.updateRequirement(id, data, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error updating requirement: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(updateRequirementAction(result.data));
    console.log('✅ Requirement actualizado:', result.data.description);
    return true;
  };

  /**
   * Eliminar un requirement
   */
  const deleteRequirement = async (id: number): Promise<boolean> => {
    const result = await service.deleteRequirement(id, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error deleting requirement: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(removeRequirement(id));
    console.log('✅ Requirement eliminado');
    return true;
  };

  return {
    loading,
    fetchRequirements,
    fetchRequirementsByWorkStation,
    fetchRequirementById,
    createRequirement,
    updateRequirement,
    deleteRequirement,
  };
};
