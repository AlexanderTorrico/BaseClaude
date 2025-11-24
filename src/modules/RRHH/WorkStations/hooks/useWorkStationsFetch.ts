import { useState } from 'react';
import { store } from '@/store';
import { IWorkStationService } from '../services/IWorkStationService';
import { setWorkStations } from '../slices/workStationsSlice';

export const useWorkStationsFetch = (service: IWorkStationService) => {
  const [loading, setLoading] = useState(false);

  
  const fetchWorkStationsByCompany = async (companyId: number = 1): Promise<void> => {
    const result = await service.getWorkStationsByCompany(companyId, setLoading);

    store.dispatch(setWorkStations(result.data));
  };

  return {
    loading,
    fetchWorkStationsByCompany,
  };
};
