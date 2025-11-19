import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICreatePageService } from '../services/ICreatePageService';
import { setCreatePages } from '../slices/createpageSlice';

/**
 * Hook para operaciones async de CreatePage (fetch, create, update, delete)
 */
export const useCreatePageFetch = (service: ICreatePageService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching createpage: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setCreatePages(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
