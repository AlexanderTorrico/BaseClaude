import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IReservationService } from '../services/IReservationService';
import { setReservations } from '../slices/reservationSlice';

/**
 * Hook para operaciones async de Reservation (fetch, create, update, delete)
 */
export const useReservationFetch = (service: IReservationService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching reservation: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setReservations(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
