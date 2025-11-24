import { useState } from 'react';
import { store } from '@/store';
import { setWorkStations } from '@/modules/RRHH/WorkStations/slices/workStationsSlice';
import { IWorkStationService } from '@/modules/RRHH/WorkStations/services/IWorkStationService';

export const useSharedWorkStationsFetch = (service: IWorkStationService) => {
  const [loading, setLoading] = useState(false);

  const workStationsLoaded = (): boolean => {
    const state = store.getState();
    return state.rrhh_workStation.list.length > 0;
  };

  const fetchWorkStations = async (companyId: number = 1): Promise<void> => {
    if (workStationsLoaded()) {
      return;
    }

    const result = await service.getWorkStationsByCompany(companyId, setLoading);
    store.dispatch(setWorkStations(result.data));
  };

  return {
    loading,
    fetchWorkStations,
    workStationsLoaded: workStationsLoaded(),
  };
};
