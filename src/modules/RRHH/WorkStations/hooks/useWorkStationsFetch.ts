import { useState } from 'react';
import { store } from '@/store';
import { IWorkStationService } from '../services/IWorkStationService';
import { setWorkStations } from '../slices/workStationsSlice';

/**
 * Hook asíncrono para WorkStations
 * Maneja las peticiones al servicio (Mock o API) y actualiza Redux
 * Recibe una implementación de IWorkStationService por inyección de dependencias
 */
export const useWorkStationsFetch = (service: IWorkStationService) => {
  const [loading, setLoading] = useState(false);

  /**
   * Obtener puestos de trabajo por compañía
   */
  const fetchWorkStationsByCompany = async (companyId: number = 1): Promise<void> => {
    const result = await service.getWorkStationsByCompany(companyId, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching workstations: [${result.status}] ${result.message}`);
      return;
    }

    console.log('✅ WorkStations cargados en hook:', result.data);
    store.dispatch(setWorkStations(result.data));
  };

  return {
    loading,
    fetchWorkStationsByCompany,
  };
};
