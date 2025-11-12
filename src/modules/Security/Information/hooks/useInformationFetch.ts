import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IInformationService } from '../services/IInformationService';
import { setInformations } from '../slices/informationSlice';

/**
 * Hook para operaciones async de Information (fetch, create, update, delete)
 */
export const useInformationFetch = (service: IInformationService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching information: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setInformations(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
