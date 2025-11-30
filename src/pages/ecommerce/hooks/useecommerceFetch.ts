import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IecommerceService } from '../services/IecommerceService';
import { setecommerces } from '../slices/ecommerceSlice';

/**
 * Hook para operaciones async de ecommerce (fetch, create, update, delete)
 */
export const useecommerceFetch = (service: IecommerceService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching ecommerce: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setecommerces(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
