import { useState } from 'react';
import { store } from '@/store';
import { IWorkStationService } from '../services/IWorkStationService';
import { setWorkStations, addWorkStation, updateWorkStation as updateWorkStationAction, deleteWorkStation as deleteWorkStationAction } from '../slices/workStationsSlice';
import { WorkStationModel } from '../models/WorkStationModel';

/**
 * Hook asíncrono para WorkStations
 * Maneja las peticiones al servicio (Mock o API) y actualiza Redux
 * Recibe una implementación de IWorkStationService por inyección de dependencias
 */
export const useWorkStationsFetch = (service: IWorkStationService) => {
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los puestos de trabajo
   */
  const fetchWorkStations = async (): Promise<void> => {
    const result = await service.getWorkStations(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching workstations: [${result.status}] ${result.message}`);
      return;
    }

    store.dispatch(setWorkStations(result.data));
  };

  /**
   * Obtener un puesto de trabajo por ID
   */
  const fetchWorkStationById = async (id: number): Promise<WorkStationModel | null> => {
    const result = await service.getWorkStationById(id, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching workstation: [${result.status}] ${result.message}`);
      return null;
    }

    return result.data;
  };

  /**
   * Crear un nuevo puesto de trabajo
   */
  const createWorkStation = async (data: Partial<WorkStationModel>): Promise<boolean> => {
    const result = await service.createWorkStation(data, setLoading);

    if (result.status !== 201) {
      console.error(`❌ Error creating workstation: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(addWorkStation(result.data));
    console.log('✅ Puesto de trabajo creado:', result.data.name);
    return true;
  };

  /**
   * Actualizar un puesto de trabajo existente
   */
  const updateWorkStation = async (id: number, data: Partial<WorkStationModel>): Promise<boolean> => {
    const result = await service.updateWorkStation(id, data, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error updating workstation: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(updateWorkStationAction(result.data));
    console.log('✅ Puesto de trabajo actualizado:', result.data.name);
    return true;
  };

  /**
   * Eliminar un puesto de trabajo
   */
  const deleteWorkStation = async (id: number): Promise<boolean> => {
    const result = await service.deleteWorkStation(id, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error deleting workstation: [${result.status}] ${result.message}`);
      return false;
    }

    store.dispatch(deleteWorkStationAction(id));
    console.log('✅ Puesto de trabajo eliminado');
    return true;
  };

  return {
    loading,
    fetchWorkStations,
    fetchWorkStationById,
    createWorkStation,
    updateWorkStation,
    deleteWorkStation,
  };
};
