import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IReservationsService } from '../services/IReservationsService';
import { setReservationss } from '../slices/reservationsSlice';

/**
 * Hook para operaciones async de Reservations (fetch, create, update, delete)
 */
export const useReservationsFetch = (service: IReservationsService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching reservations: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setReservationss(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
