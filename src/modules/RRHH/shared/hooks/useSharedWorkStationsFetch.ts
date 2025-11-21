import { useState } from 'react';
import { store } from '@/store';
import { setWorkStations } from '@/modules/RRHH/WorkStations/slices/workStationsSlice';
import WorkStationServiceSingleton from '../services/WorkStationService';

export const useSharedWorkStationsFetch = () => {
  const [loading, setLoading] = useState(false);

  const workStationsLoaded = (): boolean => {
    const state = store.getState();
    return state.rrhh_workStation.list.length > 0;
  };

  const fetchWorkStations = async (companyId: number = 1): Promise<void> => {
    if (workStationsLoaded()) {
      console.log('✅ WorkStations ya cargados, usando cache de Redux');
      return;
    }

    setLoading(true);

    try {
      const service = WorkStationServiceSingleton.getInstance();
      const result = await service.getWorkStationsByCompany(companyId, setLoading);

      if (result.status === 200 && result.data) {
        store.dispatch(setWorkStations(result.data));
        console.log('✅ WorkStations cargados:', result.data.length);
      } else {
        console.error('❌ Error al cargar WorkStations:', result.message);
        store.dispatch(setWorkStations([]));
      }
    } catch (error) {
      console.error('❌ Error en fetchWorkStations:', error);
      store.dispatch(setWorkStations([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchWorkStations,
    workStationsLoaded: workStationsLoaded(),
  };
};
